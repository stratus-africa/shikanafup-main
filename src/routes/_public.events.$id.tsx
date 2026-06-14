import { createFileRoute } from "@tanstack/react-router";
import { EventDetail } from "@/components/event-detail";

export const Route = createFileRoute("/_public/events/$id")({
  component: EventDetailPage,
});

function EventDetailPage() {
  return (
    <main className="w-full">
      <EventDetail />
    </main>
  );
}
