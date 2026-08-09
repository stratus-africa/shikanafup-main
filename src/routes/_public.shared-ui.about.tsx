import { createFileRoute } from "@tanstack/react-router";
import { AboutProfile } from "@/components/about-profile";

export const Route = createFileRoute("/_public/shared-ui/about")({
  head: () => ({
    meta: [
      { title: "About SFUP — Shikana Frontliners for Unity Party" },
      { name: "description", content: "Our mission, vision, values, team and journey." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <AboutProfile />;
}
