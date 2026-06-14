"use client"

import { TrendingUp, Users, MapPin, Zap } from "lucide-react"
import { useEffect, useState } from "react";
import { AnimatedNumber } from '@/components/motion-primitives/animated-number';

export function ImpactStory() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(2082);
  }, []);

  // const impacts = [
  //   {
  //     icon: Users,
  //     stat: "50,000+",
  //     label: "Members Mobilized",
  //     description: "Active party members working toward our vision",
  //   },
  //   {
  //     icon: MapPin,
  //     stat: "25",
  //     label: "Regions Reached",
  //     description: "Nationwide presence and grassroots engagement",
  //   },
  //   {
  //     icon: TrendingUp,
  //     stat: "1,000+",
  //     label: "Events Organized",
  //     description: "Community events and civic engagement activities",
  //   },
  //   {
  //     icon: Zap,
  //     stat: "100%",
  //     label: "Transparent Spending",
  //     description: "Full accountability for all donations",
  //   },
  // ]

  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        {/* <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Your Impact</h2>
          <p className="text-lg text-foreground/70">
            See how donations have helped us build a stronger movement.
          </p>
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {impacts.map((impact, index) => {
            const Icon = impact.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-background p-4 rounded-lg mb-4 w-fit mx-auto border border-border">
                  <Icon className="text-secondary" size={32} />
                </div>
                <AnimatedNumber
                  className='inline-flex items-center text-4xl font-bold text-foreground mb-2'
                  springOptions={{
                    bounce: 0,
                    duration: 2000,
                  }}
                  value={value}
                />
                <p className="text-lg font-bold text-secondary mb-2">{impact.label}</p>
                <p className="text-foreground/70 text-sm">{impact.description}</p>
              </div>
            )
          })}
        </div> */}

        {/* Transparency Statement */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Financial Transparency</h3>
          <p className="text-lg text-foreground/70 mb-6 max-w-2xl mx-auto">
            We believe in complete transparency. All donations are tracked and reported according to campaign finance
            regulations. Download our annual financial reports to see exactly how funds are used.
          </p>
          <button className="bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors">
            View Financial Reports
          </button>
        </div>
      </div>
    </section>
  )
}