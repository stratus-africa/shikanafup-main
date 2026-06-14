import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listPublications = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const pubInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  file_url: z.string().url(),
  cover_url: z.string().url().optional().nullable(),
  is_published: z.boolean().default(true),
});

export const createPublication = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(pubInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("publications")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "publications", row?.id ?? null, { title: data.title });
    return row;
  });

export const updatePublication = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(pubInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("publications")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "publications", id, patch);
    return row;
  });

export const deletePublication = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("publications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "publications", data.id, null);
    return { ok: true };
  });
