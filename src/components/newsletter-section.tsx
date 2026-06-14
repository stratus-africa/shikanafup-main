"use client"

import type React from "react"
import { useState } from "react"
import { Mail, CheckCircle } from "lucide-react"
import { TextShimmer } from "./motion-primitives/text-shimmer"
import Link from "next/link"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setEmail("")

      setTimeout(() => setSubmitted(false), 4000)
    }, 1200)
  }

  return (
    <section className="py-10 md:py-14 px-4 bg-muted transition-colors">
      <div className="max-w-2xl mx-auto text-center">

        {/* ICON */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4">
          <Mail className="text-secondary" size={28} />
        </div>

        <h2 className="text-primary text-4xl md:text-5xl font-bold mb-3 text-foreground">
          Stay Connected
        </h2>

        <p className="text-lg text-muted-foreground mb-2">
          Get updates, announcements, and exclusive content from Shikana Frontliners.
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          We respect your privacy. No spam —{" "}
          <Link
            href="/unsubscribe"
            className="text-secondary hover:text-primary underline hover:underline-offset-2 transition-colors"
          >
            unsubscribe
          </Link>{" "}
          anytime.
        </p>



        {/* FORM / SUCCESS */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-4">
            {/* INPUT + BUTTON ROW */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {/* CONSENT ROW */}
            <div className="flex items-start gap-2 mt-4 text-left">
              <input
                type="checkbox"
                id="newsletter-consent"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
              />
              <label
                htmlFor="newsletter-consent"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/shared-ui/terms" className="text-secondary hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/shared-ui/privacy" className="text-secondary hover:underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium animate-slide-up">
            <CheckCircle size={20} />
            <span>Thank you for subscribing!</span>
          </div>
        )}

      </div>
    </section>
  )
}
