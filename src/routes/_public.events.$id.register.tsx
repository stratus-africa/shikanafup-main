import { createFileRoute } from "@tanstack/react-router";
import EventsRegistration from "@/components/events-registration";

export const Route = createFileRoute("/_public/events/$id/register")({
  component: EventsRegisterPage,
});

function EventsRegisterPage() {
  return (
    <main className="w-full">
      <EventsRegistration />
    </main>
  );
}
