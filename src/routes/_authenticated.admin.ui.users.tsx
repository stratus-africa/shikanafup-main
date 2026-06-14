import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/ui/users")({
  beforeLoad: () => { throw redirect({ to: "/admin/ui/members" }); },
});
