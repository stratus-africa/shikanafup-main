import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({
        to: "/login",
        search: { redirect: window.location.pathname },
      } as never);
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
}
