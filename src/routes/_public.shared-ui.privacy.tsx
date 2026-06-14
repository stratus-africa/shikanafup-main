import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_public/shared-ui/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SFUP" },
      { name: "description", content: "How SFUP collects, uses and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Link to="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-secondary/10 p-3 rounded-xl">
            <ShieldCheck size={32} className="text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Privacy Policy</h1>
        </div>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Shikana Frontliners for Unity Party (SFUP) is committed to protecting your privacy.
            We collect personal information you voluntarily provide when registering as a member,
            applying for an aspirant position, or contacting us.
          </p>
          <p>
            For the full policy please review the documents on our publications page or contact
            our office directly.
          </p>
        </div>
      </div>
    </main>
  );
}
