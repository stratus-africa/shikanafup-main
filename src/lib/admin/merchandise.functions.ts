import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const listMerchandise = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("merchandise")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const merchInput = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(10_000).optional().nullable(),
  price_cents: z.number().int().nonnegative(),
  currency: z.string().min(3).max(3).default("KES"),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()).max(10).default([]),
  is_active: z.boolean().default(true),
});

export const createMerchandise = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(merchInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const slug = data.slug ?? slugify(data.name);
    const { data: row, error } = await supabase
      .from("merchandise")
      .insert({ ...data, slug })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "merchandise", row?.id ?? null, { name: data.name });
    return row;
  });

export const updateMerchandise = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(merchInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("merchandise")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "merchandise", id, patch);
    return row;
  });

export const deleteMerchandise = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("merchandise").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "merchandise", data.id, null);
    return { ok: true };
  });
