import { Link } from "@/lib/next-shims";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const dummyEvents = [
  {
    id: 1,
    title: "Tuambiane Ukweli Talk Show",
    date: "September 15, 2026",
    location: "Nairobi",
    category: "Music & Entertainment",
    image: "https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=600&h=400&fit=crop",
    description: "An engaging talk show where we discuss important national and community issues.",
  },
  {
    id: 2,
    title: "Shikana Community Festival",
    date: "October 10, 2026",
    location: "Nairobi",
    category: "Music & Entertainment",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop",
    description: "A celebration of community spirit and cultural diversity with live performances.",
  },
  {
    id: 3,
    title: "Identity Reggae Concert",
    date: "November 5, 2026",
    location: "Nairobi",
    category: "Music & Entertainment",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
    description: "A powerful musical experience celebrating identity, unity, and social justice.",
  },
  {
    id: 4,
    title: "Shikana National Development Agenda",
    date: "November 1, 2026",
    location: "Nairobi",
    category: "Frontliners & Professional",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    description: "A strategic forum for development professionals and policymakers.",
  },
  {
    id: 5,
    title: "Shikana Patriotic Week",
    date: "January 1-8, 2027",
    location: "Multiple Venues",
    category: "Music & Entertainment",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop",
    description: "A week-long celebration of patriotism and national pride.",
  },
  {
    id: 6,
    title: "Agriculture, Pastoral and Blue Economy Dialogue",
    date: "January 15, 2027",
    location: "Nairobi",
    category: "Frontliners & Professional",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
    description: "Exploring agricultural and pastoral community development opportunities.",
  },
];

export function UpcomingEventsSection() {
  const [events, setEvents] = useState(dummyEvents);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("api/events/all?limit=6");
        const eventsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        if (eventsArray.length > 0) {
          setEvents(eventsArray);
        }
      } catch (error) {
        console.error("Using dummy events", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const categories = ["All", "Music & Entertainment", "Frontliners & Professional"];
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        <div className="mb-12">
          <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b] mb-3">UPCOMING EVENTS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#162443] mb-4">Something big is coming your way</h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Be Where it Happens. An event where you can get involved, and make your voice count. Don't miss!!!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-bold transition-all ${
                selectedCategory === category
                  ? "bg-[#c9232b] text-white"
                  : "bg-slate-200 text-[#162443] hover:bg-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEvents.slice(0, 6).map((event) => (
            <Link
              key={event.id}
              href={`/shared-ui/events/${event.id}`}
              className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-[#c9232b] hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#c9232b] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {event.category?.split(" ")[0] || "Event"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#162443] mb-3 line-clamp-2 group-hover:text-[#c9232b] transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Meta Information */}
                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 text-[#c9232b] font-bold text-sm group-hover:gap-2 transition-all">
                    Learn More <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-left">
          <Link
            href="/shared-ui/events"
            className="inline-flex items-center gap-2 text-[#c9232b] font-bold hover:gap-3 transition-all"
          >
            View All Events <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
