"use client"

import { Herotext } from "./hero-text"

export function LocalGroupHero() {
    return (
        <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
            {/* Background Image - Using teamwork image as a placeholder for community */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/teamwork.jpg.jpeg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <Herotext title="Find a Local Branch" />
                <p className="text-xl md:text-2xl md:mt-2 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
Your area, your era. Connect, build, and lead with fellow frontliners from a party branch nearby. Don't just join the movement - own it. Click the link to find your people and start building from the grassroots, and let’s show the world what real leadership looks like.                 </p>
            </div>
        </section>
    )
}
