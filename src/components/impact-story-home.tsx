"use client"

import { TrendingUp, Users, MapPin, Zap } from "lucide-react"
import { useEffect, useState } from "react";
import { AnimatedNumber } from '@/components/motion-primitives/animated-number';

export function ImpactStoryHome() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(2082);
  }, []);

  const impacts = [
    {
      icon: Users,
      stat: "50,000+",
      label: "Members Mobilized",
      description: "Active party members working toward our vision",
    },
    {
      icon: MapPin,
      stat: "30",
      label: "Regions Reached",
      description: "Nationwide presence and grassroots engagement",
    },
    {
      icon: TrendingUp,
      stat: "21+",
      label: "Events Organized",
      description: "Community events and civic engagement activities",
    },
    {
      icon: Zap,
      stat: "100%",
      label: "Transparent Spending",
      description: "Full accountability for all donations",
    },
  ]

  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Your Impact</h2>
          <p className="text-lg text-foreground/70">
Donations? Vital. Volunteering? Super. Showing up to events? Unmatched. From the donations that fuel our ground game to the volunteers who show up and show out - this movement is built different because of you. See how we’re winning together.          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon
            const numericValue = parseInt(impact.stat.replace(/,/g, "").replace(/\+/g, "").replace(/%/g, "")) || 0
            const suffix = impact.stat.replace(/[0-9,]/g, "")

            return (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="bg-background p-4 rounded-lg mb-4 w-fit mx-auto border border-border/50 shadow-sm">
                  <Icon className="text-secondary" size={32} />
                </div>
                <div className="inline-flex items-center justify-center text-4xl font-bold text-foreground mb-2">
                  <AnimatedNumber
                    className="inline-flex items-center"
                    springOptions={{
                      bounce: 0,
                      duration: 2000,
                    }}
                    value={value === 0 ? 0 : numericValue}
                  />
                  <span>{suffix}</span>
                </div>
                <p className="text-lg font-bold text-secondary mb-2">{impact.label}</p>
                <p className="text-foreground/70 text-sm">{impact.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

