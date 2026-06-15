import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listVolunteers = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("volunteers")
      .select("*, profile:profiles!volunteers_profile_id_fkey(*), reviewer:profiles!volunteers_reviewed_by_fkey(id,full_name,email)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const setStatus = (next: "approved" | "rejected" | "pending") =>
  createServerFn({ method: "POST" })
    .middleware([requireStaff])
    .inputValidator(z.object({ id: z.string().uuid(), notes: z.string().max(2000).optional() }))
    .handler(async ({ data, context }) => {
      const { supabase, userId } = context as any;
      const { error } = await supabase
        .from("volunteers")
        .update({
          status: next,
          notes: data.notes ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      await writeAudit(supabase, userId, next, "volunteers", data.id, { notes: data.notes });
      return { ok: true };
    });

export const approveVolunteer = setStatus("approved");
export const rejectVolunteer = setStatus("rejected");

export const deleteVolunteer = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("volunteers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "volunteers", data.id, null);
    return { ok: true };
  });
