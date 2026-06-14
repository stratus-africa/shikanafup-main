"use client"

import { Herotext } from "./hero-text"

export function CareersHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/careers-hero.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="Work with SFUP" />
        <p className="text-xl md:text-2xl md:mt-2 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          New roles just dropped - are you in? Join us and help design a future that hits different. We’re ditching 'business as usual' for excellence that actually delivers. Your service is the blueprint. Don’t just watch history on your feed - be the one who writes it.
        </p>
      </div>
    </section>
  )
}


// hero section