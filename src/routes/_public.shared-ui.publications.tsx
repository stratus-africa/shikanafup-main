import { createFileRoute } from "@tanstack/react-router";
import { PublicationHero } from "@/components/publication-hero";
import { PublicationsSection } from "@/components/publications-section";

export const Route = createFileRoute("/_public/shared-ui/publications")({
  head: () => ({
    meta: [
      { title: "Publications — SFUP" },
      { name: "description", content: "Read SFUP policies, manifestos and publications." },
    ],
  }),
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
