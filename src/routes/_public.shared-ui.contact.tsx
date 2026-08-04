import { createFileRoute } from "@tanstack/react-router";
import { ContactHero } from "@/components/contact-hero";
import { ContactForm } from "@/components/contact-form";

export const Route = createFileRoute("/_public/shared-ui/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SFUP" },
      { name: "description", content: "Get in touch with SFUP." },
    ],
  }),
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
