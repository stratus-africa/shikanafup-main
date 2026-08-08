
import { HeroSection } from "./hero-section"
import { Herotext } from "./hero-text"
import { usePageContent } from "@/hooks/use-page-content"

export function ContactHero() {
  const { c } = usePageContent()
  return (
    <section className="relative w-full min-h-96 bg-primary overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${c("site.contact.hero_image")})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <Herotext title={c("site.contact.hero_title")} />
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-balance">{c("site.contact.hero_subtitle")}</p>
      </div>
    </section>
  )
}
