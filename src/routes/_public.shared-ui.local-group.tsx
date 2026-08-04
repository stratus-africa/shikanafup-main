import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { LocalGroupHero } from "@/components/local-group-hero";
import { LocalGroupForm } from "@/components/local-group-form";

export const Route = createFileRoute("/_public/shared-ui/local-group")({
  loader: seoLoader("local-group"),
  head: seoHead("local-group"),
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
