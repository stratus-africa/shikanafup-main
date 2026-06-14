"use client"

import { Herotext } from "./hero-text"

export function ListingHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/listing-hero.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="Wear the vision, Pursue Mission " />
        <p className="text-xl md:text-2xl md:mt-3 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          Our official gear just hit the shop - designed for the aesthetic, built for the movement. It’s more than just a fit - it’s a statement. Don’t sleep on this - Grab your gear, style it your way, and show the world what progress looks like. 
        </p>
      </div>
    </section>
  )
}
