import { createFileRoute } from "@tanstack/react-router";
import { FAQHero } from "@/components/faq-hero";
import { FAQSection } from "@/components/faq-section";

export const Route = createFileRoute("/_public/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — SFUP" },
      { name: "description", content: "Frequently asked questions about SFUP." },
    ],
  }),
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
