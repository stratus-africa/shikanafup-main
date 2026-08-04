import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { RegisterHero } from "@/components/register-hero";
import { RegisterForm } from "@/components/register-form";

export const Route = createFileRoute("/_public/shared-ui/register")({
  loader: seoLoader("register"),
  head: seoHead("register"),
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
