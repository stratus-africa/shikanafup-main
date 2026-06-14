import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const listBlogs = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("blogs")
      .select("*, author:profiles(id, full_name, avatar_url)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const blogInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  body: z.string().max(100_000).optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const createBlog = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(blogInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const slug = data.slug ?? slugify(data.title);
    const { data: row, error } = await supabase
      .from("blogs")
      .insert({
        ...data,
        slug,
        author_id: userId,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "blogs", row?.id ?? null, { title: data.title });
    return row;
  });

export const updateBlog = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(blogInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    if (patch.status === "published") {
      (patch as any).published_at = new Date().toISOString();
    }
    const { data: row, error } = await supabase
      .from("blogs")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "blogs", id, patch);
    return row;
  });

export const deleteBlog = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("blogs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "blogs", data.id, null);
    return { ok: true };
  });
