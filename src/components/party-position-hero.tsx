"use client"

import { Herotext } from "./hero-text"

export function PartyPositionHero() {
    return (
        <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/careers-hero.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <Herotext title="Step forward and serve!!" />
                <p className="text-xl md:text-2xl md:mt-2 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
Your voice is the main character energy we need. Don’t just watch history happen - write it. We’re recruiting for vacant roles where you can lead, innovate, and disrupt. This isn’t just a position; it’s a mission. Secure your spot in the movement today. Apply to join the SFUP Frontlines. Your skills + Our platform = A nation that finally works.                </p>
            </div>
        </section>
    )
}
