import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, requireAdmin, requireSuperAdmin, writeAudit, resolveMemberUserId } from "./_helpers";

export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("members")
      .select("*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)")
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
      .select("*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)")
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
    const { data: existing, error: existingError } = await supabase
      .from("members")
      .select(
        "id, member_no, tier, profile:profiles(full_name,email), application:membership_applications(first_name,last_name,email)",
      )
      .eq("id", id)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (!existing) throw new Error("Member not found");
    const { data: row, error } = await supabase.from("members").update(patch).eq("id", id).select().maybeSingle();
    if (error) throw new Error(error.message);
    const target = memberAuditTarget(existing);
    if (patch.tier !== undefined && patch.tier !== existing.tier) {
      await writeAudit(supabase, userId, "tier_changed", "member", id, {
        ...target,
        previous_tier: existing.tier,
        new_tier: patch.tier,
      });
    } else {
      await writeAudit(supabase, userId, "update", "members", id, { ...target, ...patch });
    }
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

/** Full member view used by the admin masquerade screen. */
export const getMemberAccount = createServerFn({ method: "GET" })
  .middleware([requireSuperAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: member, error } = await supabase
      .from("members")
      .select("*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(*)")
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
    await writeAudit(supabase, context.userId, "masquerade_opened", "member", data.id, {
      ...memberAuditTarget(member),
      member_user_id: userId,
    });
    return { member, userId, applications: { party, volunteer } };
  });

/** Admin sets a new password for the member's login account. */
export const setMemberPassword = createServerFn({ method: "POST" })
  .middleware([requireSuperAdmin])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      password: z.string().min(8).max(72),
      send_reset_email: z.boolean().default(true),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId: actorId } = context as any;
    const { userId } = await resolveMemberUserId(supabase, data.id);
    if (!userId) throw new Error("This member has no login account yet, so a password cannot be set.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authUserError) throw new Error(authUserError.message);
    const email = authUser.user.email;
    let resetEmailSent = false;
    let resetEmailError: string | null = null;
    if (data.send_reset_email) {
      if (!email) {
        resetEmailError = "This member has no email address for a reset link.";
      } else {
        const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: process.env.SUPABASE_PASSWORD_RESET_REDIRECT_TO || undefined,
        });
        if (resetError) resetEmailError = resetError.message;
        else resetEmailSent = true;
      }
    }
    await writeAudit(supabase, actorId, "password_updated", "member", data.id, {
      member_user_id: userId,
      reset_email_requested: data.send_reset_email,
      reset_email_sent: resetEmailSent,
      reset_email_error: resetEmailError,
    });
    return { ok: true, resetEmailSent, resetEmailError };
  });

/** Admin updates the member's profile on their behalf (masquerade). */
export const updateMemberProfile = createServerFn({ method: "POST" })
  .middleware([requireSuperAdmin])
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (patch.email) {
      const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { email: patch.email });
      if (authErr) throw new Error(authErr.message);
    }
    const { data: row, error } = await supabaseAdmin
      .from("profiles")
      .update(patch as any)
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, actorId, "masquerade_profile_updated", "member", id, {
      ...memberAuditTarget((await resolveMemberUserId(supabase, id)).member),
      updated_fields: Object.keys(patch).filter((key) => patch[key as keyof typeof patch] !== undefined),
    });
    return row;
  });

function memberAuditTarget(member: any) {
  const profile = member.profile;
  const application = member.application;
  return {
    member_no: member.member_no ?? null,
    member_name:
      profile?.full_name ?? [application?.first_name, application?.last_name].filter(Boolean).join(" ") ?? null,
    member_email: profile?.email ?? application?.email ?? null,
  };
}
