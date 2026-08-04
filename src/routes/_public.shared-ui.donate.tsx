import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { DonateHero } from "@/components/donate-hero";
import { DonationOptions } from "@/components/donation-options";
import { ImpactStory } from "@/components/impact-story";

export const Route = createFileRoute("/_public/shared-ui/donate")({
  loader: seoLoader("donate"),
  head: seoHead("donate"),
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
