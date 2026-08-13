import { Link } from "@/lib/next-shims"
import { ArrowRight, Calendar, User } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

const dummyStories = [
  {
    id: 1,
    title: "Shikana Launches Community Development Initiative",
    excerpt: "A comprehensive program aimed at empowering local communities through grassroots organizing and capacity building.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    date: "August 12, 2026",
    author: "Sarah Mwangi",
    category: "Community",
  },
  {
    id: 2,
    title: "Youth Leadership Forum Attracts Hundreds of Young Leaders",
    excerpt: "Inspiring talks and networking sessions unite Kenya's next generation of changemakers around shared values.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    date: "August 10, 2026",
    author: "James Kipchoge",
    category: "Leadership",
  },
  {
    id: 3,
    title: "Shikana's Economic Policy Gains Momentum Across Regions",
    excerpt: "New economic framework focuses on inclusive growth and equitable distribution of national resources.",
    image: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=400&fit=crop",
    date: "August 8, 2026",
    author: "Dr. Peter Omondi",
    category: "Policy",
  },
]

export function LatestNewsInsights() {
  const [stories, setStories] = useState<any[]>(dummyStories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await api.get("api/blogs/all?limit=3")
        const storiesArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
        if (storiesArray.length > 0) {
          setStories(storiesArray)
        }
      } catch (error) {
        console.error("Failed to fetch stories, using dummy data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStories();
  }, [])

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="mb-12">
          <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b] mb-3">LATEST NEWS & INSIGHTS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#162443] mb-4">Keep up with the movement.</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Stay updated with our latest articles and announcements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/shared-ui/blogs/${story.id}`}
              className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-[#c9232b] hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={story.image || story.cover_url || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {story.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-[#c9232b] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {story.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#162443] mb-3 line-clamp-2 group-hover:text-[#c9232b] transition-colors">
                  {story.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {story.excerpt || story.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{story.date || story.created_at?.split('T')[0]}</span>
                  </div>
                  <span className="text-[#c9232b] font-bold group-hover:gap-1 transition-all">
                    Read More →
                  </span>
                </div>

                {story.author && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
                    <User size={14} />
                    <span>{story.author}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-left">
          <Link
            href="/shared-ui/blogs"
            className="inline-flex items-center gap-2 text-[#c9232b] font-bold hover:gap-3 transition-all"
          >
            View All Stories <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
