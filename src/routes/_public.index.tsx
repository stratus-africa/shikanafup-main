import { createFileRoute } from "@tanstack/react-router";
import { PremiumHero } from "@/components/premium/premium-hero";
import { StatCounters } from "@/components/premium/stat-counters";
import { ManifestoTiles } from "@/components/premium/manifesto-tiles";
import { LeadershipCards } from "@/components/premium/leadership-cards";
import { KenyaPresenceMap } from "@/components/premium/kenya-presence-map";
import { GallerySection } from "@/components/premium/gallery-section";
import { OurIdeology } from "@/components/ui/ourIdeology";
import { BlogPreview } from "@/components/blog-preview";
import { EventsPreview } from "@/components/events-preview";
import { ImpactStoryHome } from "@/components/impact-story-home";
import { TestimonialsSection } from "@/components/testimonials-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { usePageContent } from "@/hooks/use-page-content";
import { seoHead, seoLoader } from "@/lib/seo";

export const Route = createFileRoute("/_public/")({
  loader: seoLoader("home"),
  head: seoHead("home"),
  component: Home,
});

function Home() {
  const { get, num } = usePageContent("home");

  return (
    <main className="w-full">
      <PremiumHero
        title={get("hero_title")}
        subtitle={get("hero_subtitle")}
        ctaPrimary={get("hero_cta_primary")}
        ctaSecondary={get("hero_cta_secondary")}
      />
      <StatCounters
        members={num("stats_members", 48000)}
        branches={num("stats_branches", 290)}
        counties={num("stats_counties", 47)}
        volunteers={num("stats_volunteers", 5600)}
      />
      <OurIdeology />
      <ManifestoTiles title={get("manifesto_title")} intro={get("manifesto_intro")} />
      <LeadershipCards title={get("leadership_title")} />
      <KenyaPresenceMap title={get("presence_title")} />
      <GallerySection title={get("gallery_title")} />
      <BlogPreview />
      <EventsPreview />
      <ImpactStoryHome />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
