import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Authenticated user-facing submissions

export const applyAsAspirant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      position_id: z.string().uuid(),
      manifesto: z.string().max(20_000).optional(),
      motivation: z.string().max(10_000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("aspirants")
      .insert({
        profile_id: userId,
        position_id: data.position_id,
        manifesto: data.manifesto ?? null,
        motivation: data.motivation ?? null,
      })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const applyAsVolunteer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      skills: z.array(z.string().max(80)).max(30).default([]),
      availability: z.string().max(200).optional(),
      areas_of_interest: z.array(z.string().max(80)).max(30).default([]),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("volunteers")
      .insert({
        profile_id: userId,
        skills: data.skills,
        availability: data.availability ?? null,
        areas_of_interest: data.areas_of_interest,
      })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const applyAsMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tier: z.string().max(80).optional(), local_group_id: z.string().uuid().optional() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("members")
      .insert({ profile_id: userId, tier: data.tier ?? null, local_group_id: data.local_group_id ?? null })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const registerForEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ event_id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("event_registrations")
      .insert({ event_id: data.event_id, profile_id: userId })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const applyForJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      job_id: z.string().uuid(),
      cover_letter: z.string().max(20_000).optional(),
      cv_url: z.string().url().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("job_applications")
      .insert({
        job_id: data.job_id,
        profile_id: userId,
        cover_letter: data.cover_letter ?? null,
        cv_url: data.cv_url ?? null,
      })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      full_name: z.string().min(1).max(200).optional(),
      phone: z.string().max(40).optional(),
      avatar_url: z.string().url().optional(),
      county: z.string().max(80).optional(),
      constituency: z.string().max(80).optional(),
      ward: z.string().max(80).optional(),
      id_number: z.string().max(40).optional(),
      dob: z.string().optional(),
      gender: z.string().max(40).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
