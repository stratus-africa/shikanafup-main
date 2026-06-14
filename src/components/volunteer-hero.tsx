"use client"

import { Herotext } from "./hero-text"

export function VolunteerHero() {
    return (
        <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/teamwork.jpg.jpeg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                <Herotext title="Volunteer" />
                <p className="text-xl md:mt-2 md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">
                    Whether you’re a builder, an organizer, or a visionary, we’re looking for the squad to change the game. Don’t just scroll past the problems - be the solution. Step forward, share your vision, and join the frontlines of a movement that's building a new era from the roots. Tell us your interests and join a team that’s actually doing the work.
                 </p>
            </div>
        </section>
    )
}
