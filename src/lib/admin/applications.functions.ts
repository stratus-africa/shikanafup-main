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
      await writeAudit(supabase, userId, "approve", "membership_applications", data.id, { member_id: member?.id });
      return { status: "approved", member };
    }

    const { data: row, error } = await supabase
      .from("membership_applications")
      .update({ status: data.status })
      .eq("id", data.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "membership_applications", data.id, { status: data.status });
    return row;
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
