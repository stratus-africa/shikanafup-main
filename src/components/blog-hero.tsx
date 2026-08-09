import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/next-shims";

export function BlogHero() {
  return (
    <section className="relative isolate min-h-[470px] overflow-hidden bg-secondary sm:min-h-[540px]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/nairobiPicture.jpg)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/35" />
      <div className="relative mx-auto flex min-h-[470px] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:min-h-[540px] sm:px-8 lg:px-12 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
        >
          <Link href="/">Home</Link>
          <ChevronRight className="size-3" />
          <span className="text-white">News & blogs</span>
        </nav>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/65">The Shikana Journal</p>
          <h1 className="mt-5 text-5xl font-bold leading-[.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            News &amp; ideas for a united Kenya.
          </h1>
          <p className="mt-6 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-8 text-white/85 sm:text-xl">
            Issue-based policy updates, stories from our communities and the ideas guiding a future worth building
            together.
          </p>
        </div>
      </div>
    </section>
  );
}
