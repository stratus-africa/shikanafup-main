"use client"

import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios";
import { toast } from "sonner";
import { Toaster } from "react-hot-toast";
import { FeaturedArticleSkeleton } from "./skeleton-loaders";

export function FeaturedArticle() {
  const [mainActiveBlogs, setMainActiveBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getActiveBlogs() {
      try {
        const response = await api.get("/api/blog/getMainBlog?isMain=Y");
        setMainActiveBlogs(response.data.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    getActiveBlogs();
  }, [])
  const [expanded, setExpanded] = useState(false)

  const words = mainActiveBlogs[0]?.content?.trim().split(/\s+/) || []
  const preview = words.slice(0, 40).join(" ")
  // const preview = words.slice(0, 20).join(" ")
  // const remaining = words.slice(40).join(" ")

  return (
    <section className="w-full bg-muted">
      <Toaster position="top-center" />
      {loading ? (
        <FeaturedArticleSkeleton />
      ) : mainActiveBlogs.length == 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">No main article available</div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Article</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-lg overflow-hidden">

            <div>
              <img
                src={mainActiveBlogs[0]?.image}
                alt="The Path to National Unity"
                className="w-full h-96 object-cover"
              />
            </div>


            <div className="p-8 space-y-6">
              <div>
                <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full font-bold text-sm mb-3">
                  {mainActiveBlogs[0]?.category || "Politics"}
                </span>
                <h3 className="text-4xl font-bold text-foreground mb-3">{mainActiveBlogs[0]?.title}</h3>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-secondary" />
                    <span>{mainActiveBlogs[0]?.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-secondary" />
                    <span>{mainActiveBlogs[0]?.posted_by}</span>
                  </div>
                </div>
              </div>


              <p className="text-foreground/80 leading-relaxed">
                {expanded ? (
                  <>
                    {mainActiveBlogs[0]?.content}
                    <button
                      className="text-secondary font-semibold ml-2"
                      onClick={() => setExpanded(false)}
                    >
                      Read Less
                    </button>
                  </>
                ) : (
                  <>
                    {preview}
                    {words.length > 40 && (
                      <>
                        ...{" "}
                        <button
                          className="text-secondary font-semibold"
                          onClick={() => setExpanded(true)}
                        >
                          Read More
                        </button>
                      </>
                    )}
                  </>
                )}
              </p>

              <Link
                href="/blog/1"
                className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors"
              >
                Read Full Article
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
