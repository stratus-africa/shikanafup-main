"use client"
import { Mail, Bell } from "lucide-react"

export function NewsletterCTA() {
  return (
    <section className="w-full py-8 md:py-12 bg-primary">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <Mail size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Stay Updated with Latest News</h2>

        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive the latest articles, policy updates, and news from SFUP directly to
          your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="flex items-center justify-center gap-2 bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors whitespace-nowrap">
            <Bell size={18} />
            Subscribe
          </button>
        </div>

        <p className="text-sm text-white/70">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  )
}
