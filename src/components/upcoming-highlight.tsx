"use client"

import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { UpcomingHighlightSkeleton } from "./skeleton-loaders"

export function UpcomingHighlight() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("api/events/all?limit=1")
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

  const preview = events[0]?.description?.trim().split(/\s+/).slice(0, 20).join(" ") || ""
  return (
    <section className="w-full bg-muted">
      {loading ? (
        <UpcomingHighlightSkeleton />
      ) : events.length === 0 ? (
        null // Hidden if no events
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Featured Event</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="rounded-lg overflow-hidden">
              <img src={events[0]?.image || "/placeholder.svg"} alt="Unity Rally 2025" className="w-full h-96 object-cover" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-secondary text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                  MAIN EVENT
                </span>
                <h3 className="text-4xl font-bold text-foreground mb-2">{events[0]?.title}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="text-secondary flex-shrink-0" size={20} />
                  <span className="text-foreground font-medium">{events[0]?.event_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-secondary flex-shrink-0" size={20} />
                  <span className="text-foreground font-medium">{events[0]?.from_time} - {events[0]?.to_time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-secondary flex-shrink-0" size={20} />
                  <span className="text-foreground font-medium">{events[0]?.location}</span>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {preview}...
              </p>

              <div className="flex gap-4 pt-4">
                <Link
                  href={`/shared-ui/events/${events[0]?.id}`}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors"
                >
                  Learn More
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={`/shared-ui/events/${events[0]?.id}/register?title=${encodeURIComponent(events[0]?.title || '')}&date=${encodeURIComponent(events[0]?.event_date || '')}&location=${encodeURIComponent(events[0]?.location || '')}&isPaid=${events[0]?.isPaid}&amount=${events[0]?.amount}`}
                  className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-bold hover:bg-secondary/10 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
