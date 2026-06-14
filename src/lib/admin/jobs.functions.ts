import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const listJobs = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("jobs")
      .select("*, applications:job_applications(count)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const jobInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(50_000).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  type: z.string().max(80).optional().nullable(),
  is_open: z.boolean().default(true),
  closes_at: z.string().optional().nullable(),
});

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(jobInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const slug = data.slug ?? slugify(data.title);
    const { data: row, error } = await supabase
      .from("jobs")
      .insert({ ...data, slug, posted_by: userId })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "jobs", row?.id ?? null, { title: data.title });
    return row;
  });

export const updateJob = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(jobInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("jobs")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "jobs", id, patch);
    return row;
  });

export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "jobs", data.id, null);
    return { ok: true };
  });

// Applications
export const listJobApplications = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ job_id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: rows, error } = await supabase
      .from("job_applications")
      .select("*, profile:profiles(*), job:jobs(id,title)")
      .eq("job_id", data.job_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["submitted", "reviewing", "shortlisted", "rejected", "hired"]),
      notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase
      .from("job_applications")
      .update({
        status: data.status,
        notes: data.notes ?? null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, data.status, "job_applications", data.id, { notes: data.notes });
    return { ok: true };
  });
