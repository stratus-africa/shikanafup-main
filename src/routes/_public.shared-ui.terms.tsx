import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/_public/shared-ui/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SFUP" },
      { name: "description", content: "Terms governing your use of SFUP services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            <FileText size={32} className="text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Terms of Service</h1>
        </div>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>
            By using SFUP services you agree to abide by our party constitution, code of conduct
            and applicable laws.
          </p>
          <p>
            Please review the full constitution and rules in our publications section.
          </p>
        </div>
      </div>
    </main>
  );
}
