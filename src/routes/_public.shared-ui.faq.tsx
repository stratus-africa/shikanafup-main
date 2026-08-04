import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { FAQHero } from "@/components/faq-hero";
import { FAQSection } from "@/components/faq-section";

export const Route = createFileRoute("/_public/shared-ui/faq")({
  loader: seoLoader("faq"),
  head: seoHead("faq"),
  component: FAQPage,
});

function FAQPage() {
  return (
    <main className="w-full">
      <FAQHero />
      <FAQSection />
    </main>
  );
}
