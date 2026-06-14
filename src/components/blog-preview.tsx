"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { BlogCardSkeleton } from "./skeleton-loaders"
import { ProfessionalEmptyState } from "./empty-state"
import { BookOpen } from "lucide-react"


export function BlogPreview() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await api.get("api/blog/all?limit=3")
        const eventsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
        setBlogs(eventsArray)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs();

  }, [])

  return (
    <section className="relative py-8 md:py-12 px-4 bg-white overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Latest News & Insights</h2>
        <p className="text-lg text-muted-foreground mb-16">Stay updated with our latest articles and announcements</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
          ) : blogs.length === 0 ? (
            <div className="col-span-full">
              <ProfessionalEmptyState
                icon={BookOpen}
                title="No Articles Available"
                description="We are currently preparing local insights. Stay tuned for updates."
              />
            </div>
          ) : (
            blogs.map((blog) => (
              <article key={blog.id} className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-secondary uppercase">{blog.category}</span>
                    <span className="text-sm text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString("en-KE")}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{blog.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{blog.content}</p>
                  <Link
                    href={`/shared-ui/blog/${blog.id}`}
                    className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

        {blogs.length > 0 && (
          <div className="text-center">
            <Link
              href="/shared-ui/blog"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              View All Articles <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
