"use client"

import { Herotext } from "./hero-text"

export function PublicationHero() {
    return (
        <section className="relative w-full min-h-[400px] bg-primary overflow-hidden flex items-center justify-center py-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/publication-hero.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <Herotext title="Publications & Documents" />
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
                    We’ve unlocked all our official docs and policy breakdowns so you can see the vision for yourself. Get the facts straight from the source and see why SFUP is the blueprint and exactly how we plan to upgrade the nation. Transparency is the only vibe we recognize.
                </p>
            </div>
        </section>
    )
}
