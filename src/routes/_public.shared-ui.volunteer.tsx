import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { VolunteerHero } from "@/components/volunteer-hero";
import { Volunteer } from "@/components/volunteer";

export const Route = createFileRoute("/_public/shared-ui/volunteer")({
  loader: seoLoader("volunteer"),
  head: seoHead("volunteer"),
  component: VolunteerPage,
});

function VolunteerPage() {
  return (
    <main className="w-full">
      <VolunteerHero />
      <Volunteer />
    </main>
  );
}
