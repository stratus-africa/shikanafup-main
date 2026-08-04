import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { AspirantHero } from "@/components/aspirant-hero";
import PoliticalRegistrationForm from "@/components/political-form";

export const Route = createFileRoute("/_public/shared-ui/political-position")({
  loader: seoLoader("political-position"),
  head: seoHead("political-position"),
  component: PoliticalPositionPage,
});

function PoliticalPositionPage() {
  return (
    <main className="w-full">
      <AspirantHero />
      <PoliticalRegistrationForm />
    </main>
  );
}
