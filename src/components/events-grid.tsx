import { Link } from "@/lib/next-shims";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publicListEvents } from "@/lib/public/content.functions";
import { ProfessionalEmptyState } from "./empty-state";
import { EventCardSkeleton } from "./skeleton-loaders";

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
    : "Date to be confirmed";

export function EventsGrid() {
  const listEvents = useServerFn(publicListEvents);
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["public", "events"],
    queryFn: () => listEvents(),
  });

  return (
    <section className="w-full bg-background py-8 md:py-12">
      <div className="mx-auto max-w-[1500px] px-4">
        <div className="mb-12">
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">All Events</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [...Array(6)].map((_, index) => <EventCardSkeleton key={index} />)
          ) : events.length === 0 ? (
            <div className="col-span-full">
              <ProfessionalEmptyState
                icon={Calendar}
                title="No Events Found"
                description="We don't have any published events scheduled at the moment. Please check back soon!"
              />
            </div>
          ) : (
            (events as any[]).map((event) => (
              <article
                key={event.id}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <img
                  src={event.cover_url || "/placeholder.svg"}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                      {event.category?.name || "Event"}
                    </span>
                    {event.capacity && (
                      <span className="text-xs font-bold text-secondary">{event.capacity} places</span>
                    )}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{event.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-foreground/70">
                    {event.description || "More event information will be shared soon."}
                  </p>
                  <div className="mb-6 space-y-2 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-secondary" />
                      {formatDate(event.starts_at)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-secondary" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <div className="mt-auto">
                    <Link
                      href={`/shared-ui/events/${event.slug}`}
                      className="inline-flex items-center gap-2 font-bold text-secondary transition-all hover:gap-3"
                    >
                      Learn more <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
