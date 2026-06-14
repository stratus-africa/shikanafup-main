import { createFileRoute } from "@tanstack/react-router";
import { LocalGroupHero } from "@/components/local-group-hero";
import { LocalGroupForm } from "@/components/local-group-form";

export const Route = createFileRoute("/_public/shared-ui/local-group")({
  head: () => ({
    meta: [
      { title: "Find a Local Group — SFUP" },
      { name: "description", content: "Find an SFUP group near you." },
    ],
  }),
  component: LocalGroupPage,
});

function LocalGroupPage() {
  return (
    <main className="w-full min-h-screen">
      <LocalGroupHero />
      <LocalGroupForm />
    </main>
  );
}
