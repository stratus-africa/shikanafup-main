import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonateHero } from "@/components/donate-hero";
import { DonationOptions } from "@/components/donation-options";
import { ImpactStory } from "@/components/impact-story";
import ProductsGrid from "@/components/listing-grid";

export const Route = createFileRoute("/_public/shared-ui/donate")({
  head: () => ({
    meta: [
      { title: "Support Us — SFUP" },
      { name: "description", content: "Support the SFUP mission through donations and official merchandise." },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <main className="w-full bg-[#f4f1ed]">
      <DonateHero />

      <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-8 md:py-14">
        <Tabs defaultValue="donate" className="w-full">
          <div className="flex justify-center">
            <TabsList className="inline-flex gap-2 rounded-full border border-[#162443]/15 bg-white p-1 shadow-sm">
              <TabsTrigger
                value="donate"
                className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#162443] data-[state=active]:bg-[#162443] data-[state=active]:text-white"
              >
                Donate
              </TabsTrigger>
              <TabsTrigger
                value="shop"
                className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#162443] data-[state=active]:bg-[#162443] data-[state=active]:text-white"
              >
                Shop
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="donate" className="mt-8">
            <DonationOptions />
          </TabsContent>

          <TabsContent value="shop" className="mt-8">
            <ProductsGrid />
          </TabsContent>
        </Tabs>
      </section>

      <ImpactStory />
    </main>
  );
}
