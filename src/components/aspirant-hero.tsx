"use client"

import { Herotext } from "./hero-text"

export function AspirantHero() {
    return (
        <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/Servant.jpeg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <Herotext title="Servant Leaders" />
                <p className="text-xl md:text-2xl md:mt-2 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
                    We’re building a future where leadership is about service, not secrets. A new era of leadership is dropping, and it’s centered on serving you. When truth is the baseline of public life, the nation actually slays. Imagine a world where the truth isn't a luxury - it’s the standard. Let’s change the game!!
                </p>
            </div>
        </section>
    )
}
