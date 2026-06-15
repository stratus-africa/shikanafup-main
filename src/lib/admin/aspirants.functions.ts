import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listAspirants = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("aspirants")
      .select("*, profile:profiles!aspirants_profile_id_fkey(*), reviewer:profiles!aspirants_reviewed_by_fkey(id,full_name,email), position:political_positions(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const setStatus = (
  next: "approved" | "rejected" | "pending" | "withdrawn",
) =>
  createServerFn({ method: "POST" })
    .middleware([requireStaff])
    .inputValidator(z.object({ id: z.string().uuid(), notes: z.string().max(2000).optional() }))
    .handler(async ({ data, context }) => {
      const { supabase, userId } = context as any;
      const { error } = await supabase
        .from("aspirants")
        .update({
          status: next,
          notes: data.notes ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      await writeAudit(supabase, userId, next, "aspirants", data.id, { notes: data.notes });
      return { ok: true };
    });

export const approveAspirant = setStatus("approved");
export const rejectAspirant = setStatus("rejected");
export const resetAspirant = setStatus("pending");

export const deleteAspirant = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("aspirants").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "aspirants", data.id, null);
    return { ok: true };
  });
