import { Mail, Bell } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="w-full bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="flex justify-center mb-6">
          <div className="border border-white/15 bg-white/10 p-4">
            <Mail size={32} className="text-white" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Stay connected</p>
        <h2 className="mb-4 mt-4 text-4xl font-bold text-white md:text-5xl">Stay updated with Shikana</h2>

        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive the latest articles, policy updates, and news from SFUP directly to
          your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 border border-white/20 bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="flex items-center justify-center gap-2 bg-primary px-8 py-3 font-bold text-white transition-colors hover:bg-primary/85 whitespace-nowrap">
            <Bell size={18} />
            Subscribe
          </button>
        </div>

        <p className="text-sm text-white/70">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  );
}
