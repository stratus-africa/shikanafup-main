import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BlogPostDetail } from "@/components/blog-post-detail";
import { CommentsSection } from "@/components/comments-section";
import { RelatedArticles } from "@/components/related-articles";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/axios";

export const Route = createFileRoute("/_public/blog/$id")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { id } = Route.useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/api/blog/get-by-id/${id}`)
      .then((res: any) => {
        if (cancelled) return;
        if (res.data?.statusCode === 200) setArticle(res.data.data);
        else setError(true);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <p className="text-center text-xl text-foreground/60">Loading article...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-secondary font-bold mb-8">
          <ArrowLeft size={20} /> Back to Blog
        </Link>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-foreground/60">Sorry, we couldn't find that article.</p>
        </div>
      </main>
    );
  }

  return (
    <article className="w-full">
      <div className="bg-muted py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-secondary font-bold">
            <ArrowLeft size={20} /> Back to Blog
          </Link>
        </div>
      </div>
      <BlogPostDetail article={article} />
      <CommentsSection articleId={article.id} />
      <RelatedArticles currentArticleId={article.id} />
    </article>
  );
}
