import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <CookieConsent />
    </>
  );
}
