"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Herotext } from "./hero-text"

const SLIDE_DURATION = 6000 // 6 seconds

const slides = [
  {
    gif: "/Sfu-login-bg.avif",
    title: "Choose the Party that Chooses You",
    description:
      "Join a movement driven by the people, for the people - united in purpose, rising for progress, and building the future we all deserve.",
  },
  {
    gif: "/sfu-image.jfif",
    title: "No One should be Left Behind",
    description:
      "Every Voice Counts, Every Choice Matters, Every Kenyan Must Move Forward and win Kenya’s future!",
  },
  {
    gif: "/unity-img.jpg",
    title: "We rise. we decide. We vote",
    description:
      "One Kenya. One Squad. A bold vision for tomorrow, powered by unity, driven by purpose, and built through progressive actions.",
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)

  // Handle progress + auto slide
  useEffect(() => {
    setProgress(0)
    const start = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
    }, 50)

    const timeout = setTimeout(() => {
      nextSlide()
    }, SLIDE_DURATION)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [current])

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden flex items-center justify-center">
      {/* BACKGROUND GIF */}
      <div className="absolute inset-0">
        <img
          key={slides[current].gif}
          src={slides[current].gif}
          alt="Hero background"
          className="w-full h-full object-cover animate-zoom"
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-primary/50" />

      {/* PREVIOUS BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-6 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>

      {/* NEXT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-6 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* CONTENT */}
      <div
        key={current}
        className="relative z-10 max-w-6xl mx-auto px-4 text-center animate-slide-up"
      >
        <Herotext title={slides[current].title} />

        <p className="text-xl md:text-2xl mt-2 text-white/90 mb-8 max-w-4xl mx-auto text-balance">
          {slides[current].description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shared-ui/register"
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg font-bold transition-colors"
          >
            Join the Movement
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/shared-ui/donate"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-primary hover:border-primary px-8 py-4 rounded-lg font-bold transition-colors"
          >
            Support Us Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* SEGMENTED PROGRESS BAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 w-[60%] max-w-md">
        {slides.map((_, index) => (
          <div
            key={index}
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            {/* Completed */}
            {index < current && (
              <div className="absolute inset-0 bg-white" />
            )}

            {/* Active */}
            {index === current && (
              <div
                className="absolute inset-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
