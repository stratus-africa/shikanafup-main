import { createFileRoute } from "@tanstack/react-router";
import { DonateHero } from "@/components/donate-hero";
import { DonationOptions } from "@/components/donation-options";
import { ImpactStory } from "@/components/impact-story";

export const Route = createFileRoute("/_public/donate")({
  head: () => ({
    meta: [
      { title: "Donate — SFUP" },
      { name: "description", content: "Support the SFUP mission with your donation." },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <main className="w-full">
      <DonateHero />
      <DonationOptions />
      <ImpactStory />
    </main>
  );
}
