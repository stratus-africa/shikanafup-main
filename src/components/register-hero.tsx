"use client"

import { Herotext } from "./hero-text"

export function RegisterHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Harvest.jpg.jpeg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="Join the Movement" />
        <p className="text-xl md:mt-2 md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          The harvest is ready and the timing is perfect. Become an SFUP Frontliner today and help us turn this vision into reality. We’re not just a party; we’re a whole movement. Your energy is the missing piece. We need it in the fields to do the work of uniting the nation. Let’s make history. 
        </p>
      </div>
    </section>
  )
}
