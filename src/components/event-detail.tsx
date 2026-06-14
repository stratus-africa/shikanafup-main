'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, Share2, Heart, ArrowRight, Facebook } from 'lucide-react'
import { events } from '@/lib/events-data'

interface Event {
  id: number
  title: string
  event_date: string
  from_time: string
  to_time: string
  location: string
  image: string
  description: string
  event_type: string
  sub_title?: string
  capacity?: string
  speakers?: string[]
  isPaid?: boolean
  amount?: number | string
}

export function EventDetail({ event }: { event: Event }) {
  const [isLiked, setIsLiked] = useState(false)

  // Get related events (same category, different event)
  // const relatedEvents = events
  //   .filter((e) => e.category === event?.category && e.id !== event?.id)
  //   .slice(0, 3)

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Image */}
        <div className="mb-12">
          <div className="relative rounded-lg overflow-hidden mb-8">
            <img
              src={event?.image || '/placeholder.svg'}
              alt={event?.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-secondary text-white px-4 py-2 rounded-full font-bold text-sm">
                {event?.event_type || 'Event'}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{event?.title}</h1>
              {/* {event?.sub_title && <p className="text-xl text-secondary font-semibold mb-2">{event.sub_title}</p>} */}
              {/* <p className="text-lg text-foreground/70">{event?.description}</p> */}
            </div>
            {/* <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-lg transition-colors ${isLiked
                  ? 'bg-secondary text-white'
                  : 'bg-muted text-foreground hover:bg-secondary/20'
                  }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-3 rounded-lg bg-muted text-foreground hover:bg-secondary/20 transition-colors">
                <Share2 size={20} />
              </button>
            </div> */}
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-secondary" size={20} />
                <span className="text-sm text-foreground/60 font-medium">Date</span>
              </div>
              <p className="text-lg font-bold text-foreground">{event?.event_date}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-secondary" size={20} />
                <span className="text-sm text-foreground/60 font-medium">Time</span>
              </div>
              <p className="text-lg font-bold text-foreground">{event?.from_time} - {event?.to_time}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-secondary" size={20} />
                <span className="text-sm text-foreground/60 font-medium">Location</span>
              </div>
              <p className="text-lg font-bold text-foreground">{event?.location}</p>
            </div>
            {event?.capacity && (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-secondary" size={20} />
                  <span className="text-sm text-foreground/60 font-medium">Capacity</span>
                </div>
                <p className="text-lg font-bold text-foreground">{event?.capacity}</p>
              </div>
            )}
            {event?.isPaid && (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-secondary font-bold text-xl">KES</span>
                  <span className="text-sm text-foreground/60 font-medium">Ticket Price</span>
                </div>
                <p className="text-lg font-bold text-foreground">{event?.amount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-foreground/80 leading-relaxed space-y-6">
                {event?.description?.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Speakers Section */}
            {event?.speakers && event?.speakers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Speakers & Participants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event?.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-secondary font-bold">{speaker.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{speaker}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Section */}
            {/* {event?.activities && event?.activities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Event Activities</h2>
                <div className="bg-muted rounded-lg p-8">
                  <ul className="space-y-3">
                    {event?.activities.map((activity, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-secondary font-bold text-lg mt-1">✓</span>
                        <span className="text-foreground font-medium">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )} */}
          </div>

          {/* Sidebar */}
          <div>
            {/* Venue Facilities */}
            {/* {event?.venueFacilities && event?.venueFacilities.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Venue Facilities</h3>
                <ul className="space-y-3">
                  {event?.venueFacilities.map((facility, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground/80">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* CTA Buttons */}
            <div className="space-y-3 mb-8">
              <Link
                href={`/shared-ui/register-event?id=${event?.id}`}
                className="block w-full bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors text-center"
              >
                Book Now
              </Link>
            </div>

            {/* Share Section */}
            <div className="bg-muted rounded-lg p-6 text-center">
              <h3 className="font-bold text-foreground mb-4">Share Event</h3>
              <div className="flex justify-center gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-full text-foreground hover:bg-secondary hover:text-white transition-all shadow-sm"
                  title="Share on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(event?.title || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-full text-foreground hover:bg-secondary hover:text-white transition-all shadow-sm"
                  title="Share on X"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent((event?.title || '') + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-full text-foreground hover:bg-secondary hover:text-white transition-all shadow-sm"
                  title="Share on WhatsApp"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9 14h6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {/* {relatedEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent?.id}
                  href={`/events/${relatedEvent?.id}`}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden h-40">
                    <img
                      src={relatedEvent?.image || '/placeholder.svg'}
                      alt={relatedEvent?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold bg-secondary text-white px-2 py-1 rounded mb-2 inline-block">
                      {relatedEvent?.category}
                    </span>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                      {relatedEvent?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4">
                      <Calendar size={16} />
                      {relatedEvent?.date}
                    </div>
                    <div className="inline-flex items-center gap-2 text-secondary font-bold group-hover:gap-3 transition-all text-sm">
                      View Event <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </section>
  )
}
