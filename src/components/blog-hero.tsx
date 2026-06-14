"use client"

import { Herotext } from "./hero-text"

export function BlogHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/nairobiPicture.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title="News & Blogs" />
        <p className="text-xl md:mt-2 md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          {/* Stay informed about our latest news, policy updates, and insights on building a unified nation. */}
          Tired of the same old politics? SFUP is keeping it real with issue-based policy updates and insights on how we’re building a future worth living in. Don't miss out on the facts and join the movement. متحدين لبناء ازدهار كينيا.
        </p>
      </div>
    </section>
  )
}
