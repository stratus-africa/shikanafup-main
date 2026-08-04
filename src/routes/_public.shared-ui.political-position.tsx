import { createFileRoute } from "@tanstack/react-router";
import { AspirantHero } from "@/components/aspirant-hero";
import PoliticalRegistrationForm from "@/components/political-form";

export const Route = createFileRoute("/_public/shared-ui/political-position")({
  head: () => ({
    meta: [
      { title: "Political Position — SFUP" },
      { name: "description", content: "Register as a political aspirant with SFUP." },
    ],
  }),
  component: PoliticalPositionPage,
});

function PoliticalPositionPage() {
  return (
    <main className="w-full">
      <AspirantHero />
      <PoliticalRegistrationForm />
    </main>
  );
}
