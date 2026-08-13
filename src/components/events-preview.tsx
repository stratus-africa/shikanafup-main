import { Link } from "@/lib/next-shims"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

const eventGroups = [
  {
    category: "Music & Entertainment",
    events: [
      {
        title: "TUAMBIANE UKWELI, TALK SHOW",
        date: "Beginning September",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=80",
        location: "Nairobi",
      },
      {
        title: "SHIKANA COMMUNITY FESTIVAL",
        date: "Beginning October",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
        location: "Kisumu",
      },
      {
        title: "IDENTITY REGGEA CONCERT",
        date: "Beginning November",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80",
        location: "Mombasa",
      },
      {
        title: "SHIKANA PATRIOTIC WEEK",
        date: "Beginning January",
        image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80",
        location: "Nakuru",
      },
      {
        title: "70KM WALK OF UNITY",
        date: "Beginning February",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80",
        location: "Nairobi",
      },
      {
        title: "40 DAYS OF PRAYER",
        date: "Beginning March",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
        location: "Nationwide",
      },
    ],
  },
  {
    category: "Frontliners & Professional",
    events: [
      {
        title: "SHIKANA NATIONAL DEVELOPMENT AGENDA",
        date: "Beginning November",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
        location: "Nairobi",
      },
      {
        title: "AGRICULTURE, PASTORAL AND BLUE ECONOMY DIALOGUE",
        date: "Beginning January",
        image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80",
        location: "Kisumu",
      },
      {
        title: "INDUSTRIAL AND INFORMAL ECONOMY DEVELOPMENT SUMMIT",
        date: "Beginning February",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
        location: "Nairobi",
      },
      {
        title: "BLUE ECONOMY AND GREEN ECONOMY FORUM",
        date: "Beginning March",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80",
        location: "Mombasa",
      },
      {
        title: "FAITH AND COMMUNITY DEVELOPMENT DIALOGUE",
        date: "Beginning April",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
        location: "Nyeri",
      },
      {
        title: "NATIONAL HERITAGE AND CREATIVE ECONOMY SUMMIT",
        date: "Beginning May",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=80",
        location: "Nairobi",
      },
    ],
  },
]

export function EventsPreview() {
  return (
    <section className="py-8 md:py-10 px-4 bg-gray-50">
      <div className="max-w-[1500px] mx-auto">
        <div className="space-y-12">
          {eventGroups.map((group) => (
            <div key={group.category}>
              <h3 className="mb-6 text-2xl font-black text-[#162443] md:text-3xl">{group.category}</h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {group.events.map((event) => (
                  <div key={event.title} className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.7)] transition hover:-translate-y-1 hover:shadow-xl">
                    <img src={event.image} alt={event.title} className="h-52 w-full object-cover" />
                    <div className="p-6 text-left">
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#c9232b]">{group.category}</p>
                      <h4 className="text-xl font-black text-[#162443] leading-tight">{event.title}</h4>
                      <div className="mt-5 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#c9232b]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#c9232b]" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-left">
          <Link href="/shared-ui/events" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-primary/90 transition-colors">
            View All Events <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
