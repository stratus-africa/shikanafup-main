"use client"

import { useState, useEffect, useMemo } from "react"
import { Send, ChevronDown, Check, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import api from "@/lib/axios"
import toast, { Toaster } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Event {
  id: number
  title: string
}

const AREAS_OF_INTEREST = [
  "Policy & Strategy",
  "Campaign Operations",
  "Communications",
  "Community Engagement",
  "Finance & Administration",
  "Youth Programs",
  "Digital Strategy",
  "Other",
]

// Initial static events as fallback
const STATIC_EVENTS = [
  { id: 1, name: "Community Cleanup Drive - November 2025" },
  { id: 2, name: "Youth Mentorship Program - Ongoing" },
  { id: 3, name: "Food Bank Distribution - Monthly" },
  { id: 4, name: "Environmental Conservation Project - December 2025" },
  { id: 5, name: "Senior Care Visit Program - Weekly" },
]

export function Volunteer() {
  const [volunteerType, setVolunteerType] = useState<"event" | "general">("general")
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selectedEventName, setSelectedEventName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("254")
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([])
  const [otherInterest, setOtherInterest] = useState("")
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim().length >= 9 &&
    consent &&
    (volunteerType === "event" ? selectedEventId !== null : true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)
        const res = await api.get("/api/events/all")
        const eventData = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        setEvents(eventData)
      } catch (err) {
        console.error("Failed to fetch events", err)
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  const handleAreaToggle = (area: string) => {
    setAreasOfInterest((prev) => {
      const isRemoving = prev.includes(area)
      // If unchecking "Other", clear the custom text
      if (isRemoving && area === "Other") {
        setOtherInterest("")
      }
      return isRemoving ? prev.filter((a) => a !== area) : [...prev, area]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!consent) {
      toast.error("Please agree to the terms and privacy policy")
      return
    }

    if (volunteerType === "event" && !selectedEventId) {
      toast.error("Please select an event")
      return
    }

    try {
      setSubmitting(true)
      // Build areas of interest, replacing "Other" with custom text if provided
      const finalAreasOfInterest = areasOfInterest.map(area =>
        area === "Other" && otherInterest.trim() ? otherInterest.trim() : area
      )

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        areas_of_interest: finalAreasOfInterest,
        volunteer_type: volunteerType,
        event_id: volunteerType === "event" ? selectedEventId : null,
        event_name: volunteerType === "event" ? selectedEventName : "General Volunteering",
      }

      await api.post("/api/volunteers/signup", payload)
      toast.success("Application submitted successfully!")

      // Reset form
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("254")
      setAreasOfInterest([])
      setOtherInterest("")
      setSelectedEventId(null)
      setSelectedEventName("")
      setConsent(false)
    } catch (err) {
      console.error("Submission failed", err)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Left Column - Volunteer Type Selection */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Select Volunteer Type
              </h3>
              <p className="text-sm text-foreground/70">
                Choose how you'd like to volunteer
              </p>
            </div>

            <div className="space-y-3">
              {/* General Volunteering Option */}
              <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/10 transition-colors"
                style={{
                  borderColor: volunteerType === "general" ? "hsl(var(--secondary))" : undefined,
                }}>
                <input
                  type="radio"
                  name="volunteerType"
                  value="general"
                  checked={volunteerType === "general"}
                  onChange={(e) => {
                    setVolunteerType("general")
                    setSelectedEventId(null)
                    setSelectedEventName("")
                  }}
                  className="w-4 h-4 rounded-full mt-1"
                />
                <div>
                  <p className="font-medium text-foreground">General Volunteer</p>
                  <p className="text-sm text-foreground/60">
                    Apply to become a general volunteer and we'll match you with opportunities
                  </p>
                </div>
              </label>

              {/* Event-Specific Option */}
              <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/10 transition-colors"
                style={{
                  borderColor: volunteerType === "event" ? "hsl(var(--secondary))" : undefined,
                }}>
                <input
                  type="radio"
                  name="volunteerType"
                  value="event"
                  checked={volunteerType === "event"}
                  onChange={() => setVolunteerType("event")}
                  className="w-4 h-4 rounded-full mt-1"
                />
                <div>
                  <p className="font-medium text-foreground">Volunteer for a Specific Event</p>
                  <p className="text-sm text-foreground/60">
                    Select an upcoming event you'd like to volunteer for
                  </p>
                </div>
              </label>
            </div>

            {/* Event Searchable Dropdown (conditional) */}
            {volunteerType === "event" && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Event *
                </label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between px-4 h-10 border-border rounded-lg text-foreground bg-background hover:bg-muted font-normal text-left focus:ring-0 focus:border-secondary transition-colors shadow-none"
                    >
                      {selectedEventName
                        ? selectedEventName
                        : "Select event..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command className="w-full">
                      <CommandInput placeholder="Search event..." className="h-9" />
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>No event found.</CommandEmpty>
                        <CommandGroup>
                          {events.length > 0 ? (
                            events.map((event) => (
                              <CommandItem
                                key={event.id}
                                value={event.title}
                                onSelect={() => {
                                  setSelectedEventId(event.id)
                                  setSelectedEventName(event.title)
                                  setPopoverOpen(false)
                                }}
                              >
                                {event.title}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedEventId === event.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>
                              {loadingEvents ? "Loading events..." : "No events available"}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Right Column - Volunteer Application Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <Toaster position="top-right" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "")
                      if (val.startsWith("0")) {
                        setPhone("254" + val.substring(1))
                      } else {
                        setPhone(val)
                      }
                    }}
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="2547XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Areas of Interest *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {AREAS_OF_INTEREST.map((area) => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={areasOfInterest.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-foreground">{area}</span>
                    </label>
                  ))}
                </div>

                {/* Custom input for "Other" */}
                {areasOfInterest.includes("Other") && (
                  <div className="mt-3">
                    <Input
                      type="text"
                      value={otherInterest}
                      onChange={(e) => setOtherInterest(e.target.value)}
                      placeholder="Please specify your area of interest"
                      className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                      required={areasOfInterest.includes("Other")}
                    />
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/10 transition-colors">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded mt-1"
                />
                <label htmlFor="consent" className="text-sm text-foreground cursor-pointer">
                  I agree to the <Link href="/shared-ui/terms" className="text-secondary hover:underline">Terms & Conditions</Link> and <Link href="/shared-ui/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="w-full bg-secondary text-white h-10 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
