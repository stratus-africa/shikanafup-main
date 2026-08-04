import { createFileRoute } from "@tanstack/react-router";
import { BlogHero } from "@/components/blog-hero";
import { BlogGrid } from "@/components/blog-grid";
import { FeaturedArticle } from "@/components/featured-article";
import { NewsletterCTA } from "@/components/newsletter-cta";

export const Route = createFileRoute("/_public/shared-ui/blog")({
  head: () => ({
    meta: [
      { title: "Blog — SFUP" },
      { name: "description", content: "Latest news, stories and insights from SFUP." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="w-full">
      <BlogHero />
      <FeaturedArticle />
      <BlogGrid />
      <NewsletterCTA />
    </main>
  );
}
