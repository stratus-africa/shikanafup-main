import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Profile + membership record for the signed-in member. */
export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    let application: any = null;
    if (profile?.email) {
      const { data } = await supabase
        .from("membership_applications")
        .select("*")
        .eq("email", profile.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      application = data;
    }

    let member: any = null;
    if (application?.id) {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("application_id", application.id)
        .maybeSingle();
      member = data;
    }
    if (!member) {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("profile_id", userId)
        .maybeSingle();
      member = data ?? null;
    }

    return { profile, application, member };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      full_name: z.string().trim().max(150).optional(),
      phone: z.string().trim().max(30).optional(),
      county: z.string().trim().max(80).optional(),
      constituency: z.string().trim().max(80).optional(),
      ward: z.string().trim().max(80).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listOpenPositions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const [party, political] = await Promise.all([
      supabase
        .from("party_positions")
        .select("id,title,description")
        .eq("is_active", true)
        .order("title"),
      supabase
        .from("political_positions")
        .select("id,title,level,description")
        .eq("is_active", true)
        .order("title"),
    ]);
    return {
      party: party.data ?? [],
      political: political.data ?? [],
    };
  });

export const applyForPartyPosition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      position_id: z.string().uuid(),
      motivation: z.string().trim().max(10_000).optional(),
      experience: z.string().trim().max(10_000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("party_position_applications")
      .insert({
        profile_id: userId,
        position_id: data.position_id,
        motivation: data.motivation ?? null,
        experience: data.experience ?? null,
      })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const applyForVolunteering = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      skills: z.array(z.string().max(80)).max(30).default([]),
      availability: z.string().trim().max(200).optional(),
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

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const [party, volunteer] = await Promise.all([
      supabase
        .from("party_position_applications")
        .select("id,status,created_at,updated_at,reviewed_at,notes,position:party_positions(title)")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("volunteers")
        .select("id,status,created_at,updated_at,reviewed_at,notes,availability,skills,areas_of_interest")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false }),
    ]);
    return { party: party.data ?? [], volunteer: volunteer.data ?? [] };
  });
