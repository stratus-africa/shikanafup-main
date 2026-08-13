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
      <section className="w-full bg-[#f4f1ed] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Financial Transparency Card - Left */}
            <div className="flex items-center">
              <ImpactStory />
            </div>
            {/* Donation Form - Right */}
            <div className="flex items-center">
              <DonationOptions />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
