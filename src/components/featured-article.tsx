import { Link } from "@/lib/next-shims";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FeaturedArticleSkeleton } from "./skeleton-loaders";

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) : "";

export function FeaturedArticle() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getActiveBlogs() {
      try {
        const response = await api.get("/api/blog/getMainBlog?isMain=Y");
        setArticles(response.data.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    getActiveBlogs();
  }, []);

  if (loading)
    return (
      <section className="bg-[#f4f1ed]">
        <FeaturedArticleSkeleton />
      </section>
    );
  if (!articles.length)
    return (
      <section className="bg-[#f4f1ed] py-16 text-center text-foreground/65">No featured article available.</section>
    );

  const article = articles[0];
  const excerpt = article.content?.trim().split(/\s+/).slice(0, 48).join(" ") ?? "";

  return (
    <section className="bg-[#f4f1ed] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">From the journal</p>
            <h2 className="mt-3 text-3xl font-bold text-secondary sm:text-4xl">Featured article</h2>
          </div>
          <span className="hidden text-sm font-semibold text-secondary/60 sm:block">Latest perspective</span>
        </div>
        <article className="grid overflow-hidden bg-white shadow-[0_20px_50px_-30px_rgba(10,25,47,.45)] lg:grid-cols-[1.15fr_.85fr]">
          <img
            src={article.image || "/about-img.jpeg"}
            alt={article.title}
            className="min-h-[300px] h-full w-full object-cover sm:min-h-[390px]"
          />
          <div className="flex flex-col p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em]">
              <span className="bg-primary px-3 py-2 text-white">{article.category || "News"}</span>
              <span className="text-foreground/45">Featured</span>
            </div>
            <h3 className="mt-6 text-3xl font-bold leading-tight text-secondary sm:text-4xl">{article.title}</h3>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/60">
              <span className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                {formatDate(article.createdAt)}
              </span>
              {article.posted_by && (
                <span className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  {article.posted_by}
                </span>
              )}
            </div>
            <p className="mt-6 leading-8 text-foreground/75">
              {excerpt}
              {excerpt && "..."}
            </p>
            <Link
              href={`/shared-ui/blog/${article.id}`}
              className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
            >
              Read full article <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
