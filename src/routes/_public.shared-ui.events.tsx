import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { EventsHero } from "@/components/events-hero";
import { EventsGrid } from "@/components/events-grid";
import { UpcomingHighlight } from "@/components/upcoming-highlight";

export const Route = createFileRoute("/_public/shared-ui/events")({
  loader: seoLoader("events"),
  head: seoHead("events"),
  component: EventsPage,
});

function EventsPage() {
  return (
    <main className="w-full">
      <EventsHero />
      <UpcomingHighlight />
      <EventsGrid />
    </main>
  );
}
