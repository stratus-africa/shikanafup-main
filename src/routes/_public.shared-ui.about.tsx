import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "@/components/about-hero";
import { MissionVision } from "@/components/mission-vision";
import { TeamSection } from "@/components/team-section";
import { ValuesSection } from "@/components/values-section";
import { TimelineSection } from "@/components/timeline-section";
import { ThematicAreas } from "@/components/thematic-areas";

export const Route = createFileRoute("/_public/shared-ui/about")({
  head: () => ({
    meta: [
      { title: "About SFUP — Shikana Frontliners for Unity Party" },
      { name: "description", content: "Our mission, vision, values, team and journey." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="w-full">
      <AboutHero />
      <div id="mission-vision" className="scroll-mt-24">
        <MissionVision />
        <ThematicAreas />
        <ValuesSection />
      </div>
      <div id="team" className="scroll-mt-24">
        <TeamSection />
      </div>
      <div id="timeline" className="scroll-mt-24">
        <TimelineSection />
      </div>
    </main>
  );
}
