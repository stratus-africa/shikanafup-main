import { createFileRoute } from "@tanstack/react-router";
import { BlogPostDetail } from "@/components/blog-post-detail";

export const Route = createFileRoute("/_public/blog/$id")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  return (
    <main className="w-full">
      <BlogPostDetail />
    </main>
  );
}
