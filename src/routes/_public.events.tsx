import { createFileRoute } from "@tanstack/react-router";
import { EventsHero } from "@/components/events-hero";
import { EventsGrid } from "@/components/events-grid";
import { UpcomingHighlight } from "@/components/upcoming-highlight";

export const Route = createFileRoute("/_public/events")({
  head: () => ({
    meta: [
      { title: "Events — SFUP" },
      { name: "description", content: "Upcoming SFUP events, rallies and meetings." },
    ],
  }),
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
