import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/hero-section";
import { OurIdeology } from "@/components/ui/ourIdeology";
import { BlogPreview } from "@/components/blog-preview";
import { EventsPreview } from "@/components/events-preview";
import { ImpactStoryHome } from "@/components/impact-story-home";
import { TestimonialsSection } from "@/components/testimonials-section";
import { NewsletterSection } from "@/components/newsletter-section";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "SFUP — Shikana Frontliners for Unity Party" },
      {
        name: "description",
        content:
          "Join the movement for unity, progress, and inclusive governance. Discover our vision for a stronger Kenya.",
      },
      { property: "og:title", content: "SFUP — Shikana Frontliners for Unity Party" },
      {
        property: "og:description",
        content: "Join the movement for unity, progress, and inclusive governance.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <OurIdeology />
      <BlogPreview />
      <EventsPreview />
      <ImpactStoryHome />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
