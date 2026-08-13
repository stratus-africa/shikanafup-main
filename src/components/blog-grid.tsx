import { useEffect, useState } from "react";
import { Link } from "@/lib/next-shims";
import api from "@/lib/axios";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Toaster } from "react-hot-toast";
import { BlogCardSkeleton } from "./skeleton-loaders";
import { ProfessionalEmptyState } from "./empty-state";
import { BookOpen } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  posted_by: string;
  image: string;
  category: string;
  readTime: string;
}
const fallbackImages = ["/unity-img.jpg", "/teamwork.jpg.jpeg", "/about-image.jpg", "/nairobiPicture.jpg"];
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });

export function BlogGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL"]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setArticles([]);
    setCategories(["ALL"]);
    const fetchData = async () => {
      try {
        const articleRes = await api.get("api/blog/all");
        if (articleRes.data.statusCode === 200) setArticles(articleRes.data.data);
        const categoryRes = await api.get("api/blog/get/all/blogCategory");
        if (categoryRes.data.statusCode === 201)
          setCategories(["ALL", ...(categoryRes.data?.data ?? []).map((cat: { category: string }) => cat.category)]);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refetchFlag]);

  const handleCategoryClick = async (category: string) => {
    setActiveCategory(category);
    if (category === "ALL") {
      setRefetchFlag(!refetchFlag);
      return;
    }
    try {
      setArticles([]);
      setLoading(true);
      const response = await api.get(`api/blog/get/all/blog/by/category?category=${category}`);
      setArticles(response.data.data);
    } catch {
      toast.error("Failed to load articles for the selected category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background py-20 sm:py-24">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="border-b border-secondary/15 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Explore the journal</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-4xl font-bold text-secondary sm:text-5xl">Latest news &amp; insights</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  onClick={() => handleCategoryClick(category)}
                  key={category}
                  aria-pressed={activeCategory === category}
                  className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${activeCategory === category ? "border-secondary bg-secondary text-white" : "border-secondary/15 text-secondary hover:border-primary hover:text-primary"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}
        {error && !loading && (
          <div className="mt-10">
            <ProfessionalEmptyState
              icon={BookOpen}
              title="Unable to Load Articles"
              description={error}
              action={
                <Button onClick={() => setRefetchFlag(!refetchFlag)} variant="outline">
                  Try Again
                </Button>
              }
            />
          </div>
        )}
        {!loading &&
          !error &&
          (articles.length === 0 ? (
            <div className="mt-10">
              <ProfessionalEmptyState
                icon={BookOpen}
                title="No Articles Found"
                description="We haven't published any articles in this category yet. Please check back later for updates."
              />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <article key={article.id} className="group flex flex-col">
                  <div className="overflow-hidden bg-muted">
                    <img
                      src={article.image || fallbackImages[index % fallbackImages.length]}
                      alt={article.title}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-b border-secondary/15 pb-6 pt-5">
                    <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[.13em]">
                      <span className="text-primary">{article.category || "News"}</span>
                      <span className="flex items-center gap-1.5 text-foreground/45">
                        <Calendar className="size-3.5" />
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold leading-tight text-secondary transition group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 leading-7 text-foreground/70">
                      {article.content?.split(" ").slice(0, 48).join(" ")}...
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-foreground/45">
                        <Clock className="size-3.5" />
                        {article.readTime || "Article"}
                      </span>
                      <Link
                        href={`/shared-ui/blog/${article.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:gap-3"
                      >
                        Read more <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
}
