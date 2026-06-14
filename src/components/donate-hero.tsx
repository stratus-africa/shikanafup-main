"use client"

import Link from "next/link"
import { Heart, TrendingUp } from "lucide-react"
import { Herotext } from "./hero-text"

export function DonateHero() {
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/donate-hero.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <Heart size={48} className="text-secondary" />
        </div>
        <Herotext title="Support Our Movement" />
        <p className="text-xl md:mt-2 md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          We’re keeping it 100: we can't do this without you. Every dollar is a high-key investment in the future we’re building. Don’t just watch from the sidelines - fuel the movement and help us secure the Win. Your support literally makes the vision possible.
        </p>
      </div>
    </section>
  )
}
