"use client"

import { Herotext } from "./hero-text"

export function EventsHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/events-hero.png"
      >
        <source src="/flag.mp4" type="video/mp4" />
        {/* Fallback image if video is not supported */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/events-hero.png)' }}
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="Events & Gatherings" />
        <p className="text-xl md:text-2xl md:mt-3 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          <span className="block font-medium">Come connect with us, embrace our vision, and help power a movement built on peace, love, and unity. Join us at SFUP events near you to share your ideas and engage with fellow citizens</span>
          ...Kama Ayala Ayatamanivyo Maji...
        </p>
      </div>
    </section>
  )
}
