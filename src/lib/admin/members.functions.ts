import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, requireAdmin, writeAudit } from "./_helpers";

export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("members")
      .select(
        "*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    // Rejected applications must never surface as members
    return (data ?? []).filter((m: any) => m.application?.status !== "rejected");
  });

export const getMember = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: row, error } = await supabase
      .from("members")
      .select(
        "*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });


const memberUpdate = z.object({
  id: z.string().uuid(),
  member_no: z.string().max(50).optional(),
  status: z.enum(["pending", "active", "suspended", "expired"]).optional(),
  tier: z.string().max(80).optional().nullable(),
  local_group_id: z.string().uuid().optional().nullable(),
  joined_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
});

export const updateMember = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(memberUpdate)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("members")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "members", id, patch);
    return row;
  });

// Hard delete: removes the member row AND its originating membership
// application so the record is fully purged from the database (no soft delete).
export const deleteMember = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;

    const { data: existing, error: readErr } = await supabase
      .from("members")
      .select("id, application_id")
      .eq("id", data.id)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);

    const { error } = await supabase.from("members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);

    if (existing?.application_id) {
      const { error: appErr } = await supabase
        .from("membership_applications")
        .delete()
        .eq("id", existing.application_id);
      if (appErr) throw new Error(appErr.message);
    }

    await writeAudit(supabase, userId, "delete", "members", data.id, {
      hard_delete: true,
      application_id: existing?.application_id ?? null,
    });
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Member account administration                                       */
/* ------------------------------------------------------------------ */

/** Resolve the auth user linked to a member row (via profile_id or email). */
async function resolveMemberUserId(supabase: any, memberId: string) {
  const { data: member, error } = await supabase
    .from("members")
    .select("id, profile_id, application:membership_applications(email)")
    .eq("id", memberId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!member) throw new Error("Member not found");
  if (member.profile_id) return { member, userId: member.profile_id as string };
  const email = (member as any).application?.email;
  if (email) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profile?.id) return { member, userId: profile.id as string };
  }
  return { member, userId: null as string | null };
}

/** Full member view used by the admin masquerade screen. */
export const getMemberAccount = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: member, error } = await supabase
      .from("members")
      .select(
        "*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!member) throw new Error("Member not found");

    const { userId } = await resolveMemberUserId(supabase, data.id);

    let party: any[] = [];
    let volunteer: any[] = [];
    if (userId) {
      const [p, v] = await Promise.all([
        supabase
          .from("party_position_applications")
          .select("id,status,created_at,updated_at,reviewed_at,notes,position:party_positions(title)")
          .eq("profile_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("volunteers")
          .select("id,status,created_at,updated_at,reviewed_at,notes,availability,skills,areas_of_interest")
          .eq("profile_id", userId)
          .order("created_at", { ascending: false }),
      ]);
      party = p.data ?? [];
      volunteer = v.data ?? [];
    }
    return { member, userId, applications: { party, volunteer } };
  });

/** Admin sets a new password for the member's login account. */
export const setMemberPassword = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({ id: z.string().uuid(), password: z.string().min(8).max(72) }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId: actorId } = context as any;
    const { userId } = await resolveMemberUserId(supabase, data.id);
    if (!userId)
      throw new Error(
        "This member has no login account yet, so a password cannot be set.",
      );
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    await writeAudit(supabase, actorId, "update", "member_password", data.id, {
      user_id: userId,
    });
    return { ok: true };
  });

/** Admin updates the member's profile on their behalf (masquerade). */
export const updateMemberProfile = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      full_name: z.string().trim().max(150).optional().nullable(),
      email: z.string().trim().email().optional().nullable(),
      phone: z.string().trim().max(30).optional().nullable(),
      county: z.string().trim().max(80).optional().nullable(),
      constituency: z.string().trim().max(80).optional().nullable(),
      ward: z.string().trim().max(80).optional().nullable(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId: actorId } = context as any;
    const { id, ...patch } = data;
    const { userId } = await resolveMemberUserId(supabase, id);
    if (!userId) throw new Error("This member has no linked profile yet.");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    if (patch.email) {
      const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email: patch.email },
      );
      if (authErr) throw new Error(authErr.message);
    }
    const { data: row, error } = await supabaseAdmin
      .from("profiles")
      .update(patch as any)
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, actorId, "update", "member_profile", id, patch);
    return row;
  });
