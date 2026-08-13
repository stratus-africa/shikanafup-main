
import { Herotext } from "./hero-text"
import { Image } from "@/lib/next-shims"
import { usePageContent } from "@/hooks/use-page-content"

export function AboutHero() {
  const { c } = usePageContent()
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={c("site.about.hero_image")}
          alt="About Shikana"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Background gradient overlay - 0.5 opacity of the blue colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40 opacity-100" />

      {/* Content */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 text-center">
        <Herotext title={c("site.about.hero_title")} />
        <p className="text-xl md:text-2xl md:mt-3 text-white/90 mb-8 max-w-4xl mx-auto text-balance">{c("site.about.hero_subtitle")}</p>
      </div>
    </section>
  )
}
