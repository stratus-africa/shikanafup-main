"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { Toaster } from "react-hot-toast"
import { BlogCardSkeleton } from "./skeleton-loaders"
import { ProfessionalEmptyState } from "./empty-state"
import { BookOpen } from "lucide-react"

interface Article {
  id: number
  title: string
  content: string
  createdAt: string
  posted_by: string
  image: string
  category: string
  readTime: string
}

export function BlogGrid() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<String[]>(["ALL"])
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setArticles([]);
    setCategories(["ALL"]);
    const fetchData = async () => {
      try {
        // Fetch Articles
        const articleRes = await api.get("api/blog/all")
        if (articleRes.data.statusCode === 200) {
          setArticles(articleRes.data.data)
        }

        // Fetch Categories
        const categoryRes = await api.get("api/blog/get/all/blogCategory")
        if (categoryRes.data.statusCode === 201) {
          setCategories(prev => [...prev, ...categoryRes.data?.data.map((cat: { category: string }) => cat.category)]);
          console.log('catergory data1', categoryRes.data.data);

        }
        console.log('catergory data', categoryRes.data.data);
      } catch (err) {
        console.error(err)
        setError("Failed to load data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refetchFlag])

  const handleCategoryClick = async (category: String) => {
    if (category === "ALL") {
      setRefetchFlag(!refetchFlag);
      return;
    }
    try {
      setArticles([]);
      setLoading(true);
      const response = await api.get(`api/blog/get/all/blog/by/category?category=${category}`);
      setArticles(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load articles for the selected category.");
    }
  }

  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance">
            All Articles
          </h2>

          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap gap-3">
            {Array.isArray(categories) && categories.length !== 0 ? (
              categories.map((category, index) => (
                <button
                  onClick={() => handleCategoryClick(categories[index])}
                  key={index}
                  className={`px-4 py-1 rounded-lg font-medium transition-colors ${categories[index] === "ALL"
                    ? "bg-secondary text-white"
                    : "bg-muted text-foreground hover:bg-secondary hover:text-white"
                    }`}
                >
                  {categories[index]}
                </button>
              ))
            ) : (
              <Button variant="secondary" className="px-4 py-2 rounded-lg font-medium transition-colors">All</Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
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
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full">
                <ProfessionalEmptyState
                  icon={BookOpen}
                  title="No Articles Found"
                  description="We haven't published any articles in this category yet. Please check back later for updates."
                />
              </div>
            ) : (
              articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold bg-secondary text-white px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-1">
                      {article.content.split(" ").slice(0, 70).join(" ") + "..."}
                    </p>

                    <div className="space-y-2 mb-4 text-xs text-foreground/60">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-secondary" />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User size={14} className="text-secondary" />
                        <span>{article.posted_by}</span>
                      </div>
                    </div>

                    <Link
                      href={`/shared-ui/blog/${article.id}`}
                      className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
