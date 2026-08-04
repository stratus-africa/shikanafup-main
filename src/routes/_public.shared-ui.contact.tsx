import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { ContactHero } from "@/components/contact-hero";
import { ContactForm } from "@/components/contact-form";

export const Route = createFileRoute("/_public/shared-ui/contact")({
  loader: seoLoader("contact"),
  head: seoHead("contact"),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="w-full">
      <ContactHero />
      <ContactForm />
    </main>
  );
}
