import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/ui/roles")({
  beforeLoad: () => { throw redirect({ to: "/admin/ui/admin-users" }); },
});
