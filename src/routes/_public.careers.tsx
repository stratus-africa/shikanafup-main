import { createFileRoute } from "@tanstack/react-router";
import { CareersHero } from "@/components/careers-hero";
import { CultureSection } from "@/components/culture-section";
import { JobListings } from "@/components/job-listings";

export const Route = createFileRoute("/_public/careers")({
  head: () => ({
    meta: [
      { title: "Careers — SFUP" },
      { name: "description", content: "Join the SFUP team. Explore open roles." },
    ],
  }),
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
