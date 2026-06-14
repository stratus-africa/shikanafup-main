import { createFileRoute } from "@tanstack/react-router";
import { RegisterHero } from "@/components/register-hero";
import { RegisterForm } from "@/components/register-form";

export const Route = createFileRoute("/_public/register")({
  head: () => ({
    meta: [
      { title: "Become a Member — SFUP" },
      { name: "description", content: "Register as an SFUP member." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main className="w-full">
      <RegisterHero />
      <RegisterForm />
    </main>
  );
}
