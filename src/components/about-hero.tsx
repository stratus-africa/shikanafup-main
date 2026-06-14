"use client"

import { Herotext } from "./hero-text"
import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/about-img.jpeg"
          alt="About Shikana"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Background gradient overlay - 0.5 opacity of the blue colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40 opacity-100" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="About Us" />
        <p className="text-xl md:text-2xl md:mt-3 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          Rooted in the vision of our founding members and guided by the unwavering commitment of the party leadership, we are committed to building a stronger, united nation through leadership defined by integrity, transparency, and accountability
        </p>
      </div>
    </section>
  )
}
