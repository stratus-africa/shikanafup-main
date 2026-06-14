import { createFileRoute } from "@tanstack/react-router";
import { VolunteerHero } from "@/components/volunteer-hero";
import { Volunteer } from "@/components/volunteer";

export const Route = createFileRoute("/_public/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — SFUP" },
      { name: "description", content: "Volunteer with SFUP and make an impact." },
    ],
  }),
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
