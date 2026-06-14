// Public, unauthenticated server fns for content reads and form submissions.
// Reads use the admin client with explicit safe-column projection to avoid
// requiring broad anon RLS grants. Submissions use the user-scoped client
// when signed in, or anon via the admin client otherwise.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const sb = async () =>
  (await import("@/integrations/supabase/client.server")).supabaseAdmin;

// ===== Reads =====
export const publicListEvents = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, slug, description, location, starts_at, ends_at, cover_url, capacity, category:event_categories(id,name,color)")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicGetEvent = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const supabase = await sb();
    const { data: row, error } = await supabase
      .from("events")
      .select("id, title, slug, description, location, starts_at, ends_at, cover_url, capacity, category:event_categories(id,name,color)")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const publicListBlogs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_url, tags, published_at, author:profiles(id, full_name, avatar_url)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicGetBlog = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const supabase = await sb();
    const { data: row, error } = await supabase
      .from("blogs")
      .select("id, title, slug, excerpt, body, cover_url, tags, published_at, author:profiles(id, full_name, avatar_url)")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const publicListPublications = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("publications")
    .select("id, title, description, file_url, cover_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicListJobs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, slug, description, location, type, closes_at, created_at")
    .eq("is_open", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicListMerchandise = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("merchandise")
    .select("id, name, slug, description, price_cents, currency, images, stock")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicListPoliticalPositions = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("political_positions")
    .select("id, title, level, description")
    .eq("is_active", true)
    .order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const publicListFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await sb();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, sort_order")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ===== Submissions =====
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(200),
      email: z.string().email(),
      phone: z.string().max(40).optional(),
      subject: z.string().max(200).optional(),
      body: z.string().min(1).max(5000),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = await sb();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitAnonymousDonation = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      donor_name: z.string().min(1).max(200),
      donor_email: z.string().email().optional(),
      donor_phone: z.string().max(40).optional(),
      amount_cents: z.number().int().positive(),
      currency: z.string().min(3).max(3).default("KES"),
      method: z.string().max(80).optional(),
      reference: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = await sb();
    const { data: row, error } = await supabase
      .from("donations")
      .insert({ ...data, status: "pending" })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
