import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, writeAudit } from "./_helpers";

export const listDonations = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("donations")
      .select("*, donor:profiles(id, full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const donationInput = z.object({
  donor_name: z.string().max(200).optional().nullable(),
  donor_email: z.string().email().optional().nullable(),
  donor_phone: z.string().max(40).optional().nullable(),
  amount_cents: z.number().int().positive(),
  currency: z.string().min(3).max(3).default("KES"),
  method: z.string().max(80).optional().nullable(),
  reference: z.string().max(200).optional().nullable(),
  status: z.enum(["pending", "completed", "failed", "refunded"]).default("completed"),
  notes: z.string().max(2000).optional().nullable(),
});

export const recordDonation = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(donationInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("donations")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "donations", row?.id ?? null, { amount_cents: data.amount_cents });
    return row;
  });

export const updateDonation = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(donationInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("donations")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "donations", id, patch);
    return row;
  });

export const deleteDonation = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("donations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "donations", data.id, null);
    return { ok: true };
  });
