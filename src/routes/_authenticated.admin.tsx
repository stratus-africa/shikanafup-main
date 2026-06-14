import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminNavMain, adminUser } from "@/lib/admin-nav";
import { getMyAdminContext } from "@/lib/admin/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const ctx = await getMyAdminContext();
      if (!ctx.isStaff) throw redirect({ to: "/" });
      return { adminCtx: ctx };
    } catch (e: any) {
      if (e?.isRedirect) throw e;
      const msg = String(e?.message ?? "");
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("no authorization")) {
        throw redirect({ to: "/login" });
      }
      throw redirect({ to: "/" });
    }
  },
  component: AdminShell,
});

function AdminShell() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" navItems={adminNavMain} user={adminUser} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
