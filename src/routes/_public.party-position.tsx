import { createFileRoute } from "@tanstack/react-router";
import { PartyPositionHero } from "@/components/party-position-hero";
import PartyPositionForm from "@/components/party-position-form";

export const Route = createFileRoute("/_public/party-position")({
  head: () => ({
    meta: [
      { title: "Party Position — SFUP" },
      { name: "description", content: "Apply for an SFUP party position." },
    ],
  }),
  component: PartyPositionPage,
});

function PartyPositionPage() {
  return (
    <main className="w-full">
      <PartyPositionHero />
      <PartyPositionForm />
    </main>
  );
}
