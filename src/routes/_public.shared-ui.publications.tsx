import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { PublicationHero } from "@/components/publication-hero";
import { PublicationsSection } from "@/components/publications-section";

export const Route = createFileRoute("/_public/shared-ui/publications")({
  loader: seoLoader("publications"),
  head: seoHead("publications"),
  component: PublicationsPage,
});

function PublicationsPage() {
  return (
    <main className="w-full">
      <PublicationHero />
      <PublicationsSection />
    </main>
  );
}
