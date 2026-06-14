import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * One-time bootstrap: promotes the calling user to super_admin if no
 * super_admin exists yet. Safe because once a super_admin is set, this is a
 * no-op. Use this immediately after creating your first account.
 */
export const claimFirstSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as any;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin")
      .limit(1);
    if (checkErr) throw new Error(checkErr.message);
    if (existing && existing.length > 0) {
      return { claimed: false, reason: "super_admin already exists" };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "super_admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { claimed: true, user_id: userId };
  });
