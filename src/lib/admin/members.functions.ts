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
        "*, profile:profiles(*), local_group:local_groups(id,name), application:membership_applications(first_name,last_name,email,phone,county,membership_type,status)",
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

export const deleteMember = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "members", data.id, null);
    return { ok: true };
  });
