import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { BlogHero } from "@/components/blog-hero";
import { BlogGrid } from "@/components/blog-grid";
import { FeaturedArticle } from "@/components/featured-article";
import { NewsletterCTA } from "@/components/newsletter-cta";

export const Route = createFileRoute("/_public/shared-ui/blog")({
  loader: seoLoader("blog"),
  head: seoHead("blog"),
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
