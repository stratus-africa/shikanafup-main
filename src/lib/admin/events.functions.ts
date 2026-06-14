import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const listEvents = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("events")
      .select("*, category:event_categories(id, name, color)")
      .order("starts_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listEventCategories = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("event_categories")
      .select("*")
      .order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createEventCategory = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ name: z.string().min(1).max(80), color: z.string().max(20).optional() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("event_categories")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "event_categories", row?.id ?? null, data);
    return row;
  });

const eventInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  category_id: z.string().uuid().optional().nullable(),
  description: z.string().max(20_000).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  starts_at: z.string(),
  ends_at: z.string().optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
  capacity: z.number().int().nonnegative().optional().nullable(),
  is_published: z.boolean().default(false),
});

export const createEvent = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(eventInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const slug = data.slug ?? slugify(data.title);
    const { data: row, error } = await supabase
      .from("events")
      .insert({ ...data, slug, created_by: userId })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "events", row?.id ?? null, { title: data.title });
    return row;
  });

export const updateEvent = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(eventInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("events")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "events", id, patch);
    return row;
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "events", data.id, null);
    return { ok: true };
  });

export const listEventRegistrations = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ event_id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: rows, error } = await supabase
      .from("event_registrations")
      .select("*, profile:profiles(*)")
      .eq("event_id", data.event_id)
      .order("registered_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
