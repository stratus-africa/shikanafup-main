"use client"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { EventCardSkeleton } from "./skeleton-loaders"
import { ProfessionalEmptyState } from "./empty-state"

export function EventsPreview() {

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("api/events/all?limit=3")
        const eventsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
        setEvents(eventsArray)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents();
  }, [])
  return (
    <section className="py-8 md:py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Upcoming Events</h2>
        <p className="text-lg text-muted-foreground mb-8">Something big is coming your way — an event where you can get involved, and make your voice count. Don’t miss !!!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            [...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)
          ) : events.length === 0 ? (
            <div className="col-span-full">
              <ProfessionalEmptyState
                icon={Calendar}
                title="No Events Available"
                description="We are currently planning our next community engagements. Check back soon for updates!"
              />
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3">{event.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        {event.event_date}
                      </div>
                      {event.isPaid && (
                        <span className="text-xs font-bold text-secondary">
                          KES {event.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      {event.location}
                    </div>
                  </div>
                  <Link
                    href={`/shared-ui/events/${event.id}`}
                    className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {events.length > 0 && (

          <div className="text-center">
            <Link
              href="/shared-ui/events"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              View All Events <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
