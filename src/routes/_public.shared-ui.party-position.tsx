import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { PartyPositionHero } from "@/components/party-position-hero";
import PartyPositionForm from "@/components/party-position-form";

export const Route = createFileRoute("/_public/shared-ui/party-position")({
  loader: seoLoader("party-position"),
  head: seoHead("party-position"),
  component: PartyPositionPage,
});

function PartyPositionPage() {
  return (
    <main className="w-full">
      <PartyPositionHero />
      <PartyPositionForm />
    </main>
  );
}
