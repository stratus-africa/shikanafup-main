import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listFaqs = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const faqInput = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(10_000),
  category: z.string().max(80).optional().nullable(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const createFaq = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(faqInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("faqs")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "faqs", row?.id ?? null, { question: data.question });
    return row;
  });

export const updateFaq = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(faqInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("faqs")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "faqs", id, patch);
    return row;
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "faqs", data.id, null);
    return { ok: true };
  });
