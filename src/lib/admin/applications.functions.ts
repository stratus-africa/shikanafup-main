import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("membership_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "approved", "rejected"]),
      reason: z.string().max(500).optional().nullable(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;

    if (data.status === "approved") {
      const { data: member, error: approveErr } = await supabase.rpc(
        "approve_membership_application",
        { _application_id: data.id },
      );
      if (approveErr) throw new Error(approveErr.message);
      await writeAudit(supabase, userId, "approve", "membership_applications", data.id, {
        member_id: member?.id,
        member_no: member?.member_no,
      });
      return { status: "approved", member };
    }

    if (data.status === "rejected") {
      const { data: row, error: rejectErr } = await supabase.rpc(
        "reject_membership_application",
        { _application_id: data.id, _reason: data.reason ?? null },
      );
      if (rejectErr) throw new Error(rejectErr.message);
      await writeAudit(supabase, userId, "reject", "membership_applications", data.id, {
        reason: data.reason ?? null,
      });
      return row;
    }

    const { data: row, error } = await supabase
      .from("membership_applications")
      .update({
        status: data.status,
        rejection_reason: null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "membership_applications", data.id, { status: data.status });
    return row;
  });

export const listApplicationAudit = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("id, action, diff, created_at, actor_id, actor:profiles!audit_logs_actor_id_fkey(full_name,email)")
      .eq("entity", "membership_applications")
      .eq("entity_id", data.id)
      .order("created_at", { ascending: false });
    if (error) {
      const fallback = await supabase
        .from("audit_logs")
        .select("id, action, diff, created_at, actor_id")
        .eq("entity", "membership_applications")
        .eq("entity_id", data.id)
        .order("created_at", { ascending: false });
      if (fallback.error) throw new Error(fallback.error.message);
      return fallback.data ?? [];
    }
    return logs ?? [];
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase
      .from("membership_applications")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "membership_applications", data.id, null);
    return { ok: true };
  });
