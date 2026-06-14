"use client"

import { HeroSection } from "./hero-section"
import { Herotext } from "./hero-text"

export function ContactHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/deer.gif)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="Get in Touch" />
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          {/* We'd love to hear from you. Reach out with questions, feedback, or partnership inquiries. */}
          History is written by those who dare speak. Bring your ideas, questions, and proposals, and join us in building a movement that reshapes our future.
        </p>
      </div>
    </section>
  )
}
