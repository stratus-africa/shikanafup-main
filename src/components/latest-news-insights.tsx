import { Link } from "@/lib/next-shims";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publicListBlogs } from "@/lib/public/content.functions";

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
    : "Latest update";

export function LatestNewsInsights() {
  const listBlogs = useServerFn(publicListBlogs);
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["public", "blogs"],
    queryFn: () => listBlogs(),
  });
  const latestStories = stories.slice(0, 3) as any[];

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1500px] px-4">
        <div className="mb-12">
          <p className="mb-3 text-sm font-bold tracking-[0.16em] text-[#c9232b]">LATEST NEWS &amp; INSIGHTS</p>
          <h2 className="mb-4 text-4xl font-bold text-[#162443] md:text-5xl">Keep up with the movement.</h2>
          <p className="max-w-2xl text-lg text-slate-600">Stories and announcements published by the Shikana team.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : latestStories.length ? (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestStories.map((story) => (
              <Link
                key={story.id}
                href={`/shared-ui/blog/${story.slug}`}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-[#c9232b] hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.cover_url || "/placeholder.svg"}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {story.tags?.[0] && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#c9232b] px-3 py-1 text-xs font-bold text-white">
                      {story.tags[0]}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#162443] transition-colors group-hover:text-[#c9232b]">
                    {story.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {story.excerpt || "Read the latest news and insights from Shikana."}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(story.published_at)}
                    </span>
                    <span className="font-bold text-[#c9232b]">Read more</span>
                  </div>
                  {story.author?.full_name && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                      <User size={14} />
                      {story.author.full_name}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mb-8 rounded-lg border border-dashed p-8 text-sm text-slate-600">
            No news has been published yet. New posts from the Blogs area will appear here.
          </div>
        )}

        <Link
          href="/shared-ui/blog"
          className="inline-flex items-center gap-2 font-bold text-[#c9232b] transition-all hover:gap-3"
        >
          View all stories <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
