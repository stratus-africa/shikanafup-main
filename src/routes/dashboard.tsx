import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isStaff = (roles ?? []).some((r: any) =>
      ["super_admin", "admin", "editor", "moderator"].includes(r.role),
    );
    throw redirect({ to: isStaff ? "/admin/dashboard" : "/" });
  },
});
