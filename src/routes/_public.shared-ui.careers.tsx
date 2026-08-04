import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { CareersHero } from "@/components/careers-hero";
import { CultureSection } from "@/components/culture-section";
import { JobListings } from "@/components/job-listings";

export const Route = createFileRoute("/_public/shared-ui/careers")({
  loader: seoLoader("careers"),
  head: seoHead("careers"),
  component: CareersPage,
});

function CareersPage() {
  return (
    <main className="w-full">
      <CareersHero />
      <CultureSection />
      <JobListings />
    </main>
  );
}
