import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdmin, STAFF_ROLES, writeAudit } from "./_helpers";

// Returns the current user's profile + roles, used by the admin layout gate.
export const getMyAdminContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roleList = (roles ?? []).map((r: any) => r.role as string);
    return {
      userId,
      profile,
      roles: roleList,
      isStaff: roleList.some((r: string) => STAFF_ROLES.includes(r as any)),
      isAdmin: roleList.some((r: string) => ["super_admin", "admin"].includes(r)),
      isSuperAdmin: roleList.includes("super_admin"),
    };
  });

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .in("role", STAFF_ROLES as any);
    if (error) throw new Error(error.message);
    const userIds = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, avatar_url")
      .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
    const grouped = new Map<string, any>();
    for (const r of roles ?? []) {
      const existing = grouped.get(r.user_id) ?? {
        user_id: r.user_id,
        profile: byId.get(r.user_id) ?? null,
        roles: [] as string[],
        created_at: r.created_at,
      };
      existing.roles.push(r.role);
      grouped.set(r.user_id, existing);
    }
    return Array.from(grouped.values());
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      email: z.string().email(),
      full_name: z.string().min(1).max(200),
      phone: z.string().max(40).optional(),
      role: z.enum(["admin", "editor", "moderator"]),
      send_invite: z.boolean().default(true),
    }),
  )
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context as any;
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    let targetUserId: string;
    if (data.send_invite) {
      const { data: invited, error } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
          data: { full_name: data.full_name, phone: data.phone },
        });
      if (error) throw new Error(error.message);
      targetUserId = invited.user!.id;
    } else {
      const tempPwd =
        crypto.randomUUID().replace(/-/g, "") + "Aa1!";
      const { data: created, error } =
        await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: tempPwd,
          email_confirm: true,
          user_metadata: { full_name: data.full_name, phone: data.phone },
        });
      if (error) throw new Error(error.message);
      targetUserId = created.user!.id;
    }
    await supabaseAdmin
      .from("profiles")
      .update({ full_name: data.full_name, phone: data.phone ?? null })
      .eq("id", targetUserId);
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: targetUserId, role: data.role },
        { onConflict: "user_id,role" },
      );
    if (roleErr) throw new Error(roleErr.message);
    await writeAudit(supabase, userId, "create", "admin_user", targetUserId, {
      email: data.email,
      role: data.role,
    });
    return { user_id: targetUserId };
  });

export const updateUserRoles = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      user_id: z.string().uuid(),
      roles: z.array(
        z.enum(["super_admin", "admin", "editor", "moderator", "member"]),
      ),
    }),
  )
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context as any;
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    // Only super_admin may assign super_admin
    if (data.roles.includes("super_admin")) {
      const { data: isSuper } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "super_admin",
      });
      if (!isSuper) throw new Error("Only super admins can assign super_admin");
    }
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    if (data.roles.length) {
      const rows = data.roles.map((role) => ({ user_id: data.user_id, role }));
      const { error } = await supabaseAdmin.from("user_roles").insert(rows);
      if (error) throw new Error(error.message);
    }
    await writeAudit(supabase, userId, "update", "user_roles", data.user_id, {
      roles: data.roles,
    });
    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ user_id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context as any;
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    if (data.user_id === userId) throw new Error("Cannot delete yourself");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "admin_user", data.user_id, null);
    return { ok: true };
  });
