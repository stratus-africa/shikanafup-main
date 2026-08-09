import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const STAFF_ROLES: AppRole[] = [
  "super_admin",
  "admin",
  "editor",
  "moderator",
];

export const ADMIN_ROLES: AppRole[] = ["super_admin", "admin"];

/**
 * Middleware that ensures the caller is a staff member.
 * Use .middleware([requireStaff]) on server fns that mutate admin data.
 * Reads roles directly so RLS still applies for the queries.
 */
export const requireStaff = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as {
      supabase: any;
      userId: string;
    };
    const { data, error } = await supabase
      .rpc("has_any_role", { _user_id: userId, _roles: STAFF_ROLES });
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Forbidden: staff role required");
    return next();
  });

export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as {
      supabase: any;
      userId: string;
    };
    const { data, error } = await supabase
      .rpc("has_any_role", { _user_id: userId, _roles: ADMIN_ROLES });
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Forbidden: admin role required");
    return next();
  });

export async function writeAudit(
  supabase: any,
  actorId: string,
  action: string,
  entity: string,
  entityId: string | null,
  diff: Record<string, unknown> | null,
) {
  try {
    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId,
      diff,
    });
  } catch (e) {
    console.error("[audit] failed to write log", e);
  }
}

/** Resolve the auth user linked to a member row (via profile_id or email). */
export async function resolveMemberUserId(supabase: any, memberId: string) {
  const { data: member, error } = await supabase
    .from("members")
    .select("id, profile_id, application:membership_applications(email)")
    .eq("id", memberId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!member) throw new Error("Member not found");
  if (member.profile_id) return { member, userId: member.profile_id as string };
  const email = (member as any).application?.email;
  if (email) {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profile?.id) return { member, userId: profile.id as string };
  }
  return { member, userId: null as string | null };
}

