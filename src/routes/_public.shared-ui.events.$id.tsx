import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EventDetail } from "@/components/event-detail";
import { EventDetailSkeleton } from "@/components/skeleton-loaders";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/axios";

export const Route = createFileRoute("/_public/shared-ui/events/$id")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { id } = Route.useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`api/events/get/by/id/${id}`)
      .then((res: any) => {
        if (cancelled) return;
        const data = Array.isArray(res.data)
          ? res.data[0]
          : res.data?.data
            ? Array.isArray(res.data.data)
              ? res.data.data[0]
              : res.data.data
            : null;
        setEvent(data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <EventDetailSkeleton />;

  if (!event) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <Link to="/events" className="inline-flex items-center gap-2 text-secondary font-bold mb-8">
          <ArrowLeft size={20} /> Back to Events
        </Link>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="text-foreground/60">Sorry, we couldn't find that event ({id}).</p>
        </div>
      </main>
    );
  }

  return (
    <article className="w-full">
      <div className="bg-muted py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/events" className="inline-flex items-center gap-2 text-secondary font-bold">
            <ArrowLeft size={20} /> Back to Events
          </Link>
        </div>
      </div>
      <EventDetail event={event} />
    </article>
  );
}
