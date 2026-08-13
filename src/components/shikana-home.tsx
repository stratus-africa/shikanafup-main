import { useEffect, useState } from "react";
import { Link } from "@/lib/next-shims";
import { ArrowDown, ArrowRight, HeartHandshake, MapPinned, Sparkles, Users, Vote } from "lucide-react";
import { EventsPreview } from "./events-preview";
import { ImpactStoryHome } from "./impact-story-home";
import { CampaignPopup } from "./campaign-popup";
import { TestimonialsSection } from "./testimonials-section";

const actions = [
  {
    icon: Users,
    title: "Become a Member",
    copy: "Take your place in a movement built around the people.",
    href: "/shared-ui/register",
  },
  {
    icon: Vote,
    title: "Become an Aspirant",
    copy: "Put yourself forward to serve your community.",
    href: "/shared-ui/political-position",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer",
    copy: "Give your time and skills to the work that matters.",
    href: "/shared-ui/volunteer",
  },
  {
    icon: MapPinned,
    title: "Find a Local Branch",
    copy: "Connect with Shikana where you live.",
    href: "/shared-ui/local-group",
  },
];

const openingFrames = [
  { title: "Discover", text: "The awakening of our people to their shared identity, common destiny, and collective power." },
  { title: "Freedom", text: "We are the force that will stand on the frontlines for Kenya; to protect our land and resources." },
  { title: "Truth", text: "We commit to the spirit of truth, serve Kenyans fairly and guarantee equal opportunity for all." },
  { title: "Prosperity", text: "Our true progress is measured by ensuring that growth reaches every corner of Kenya." },
  { title: "Shikana", text: "Frontliners for Unity Party." },
];

const fiveCs = ["Cultures", "Communities", "Constituencies", "Counties", "Country"];

const nationalPriorities = [
  {
    number: "01",
    title: "A New Generation is Awakening",
    copy: "Kenya's youthful, connected and entrepreneurial population, together with the wisdom of older generations, can drive structural transformation, national renewal and shared progress.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "02",
    title: "No One Should Be Left Behind",
    copy: "Revolution means opportunity for all and privilege for none. Progress is measured by whether development, dignity and opportunity reach every corner of Kenya.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "03",
    title: "We Rise. We Decide. We Vote.",
    copy: "Every citizen must find their voice. An informed, organised and active citizenry is essential to a Kenya built on accountability, participation and democratic renewal.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  },
];

export function ShikanaHome() {
  const [flipIndex, setFlipIndex] = useState(0);

  useEffect(() => {
    const sequence = ["Discover Freedom Truth Prosperity", ...openingFrames.map((frame) => `${frame.title} — ${frame.text}`), "Shikana Frontliners for Unity Party"];
    const timer = window.setInterval(() => {
      setFlipIndex((current) => (current + 1) % sequence.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const sequence = ["Discover Freedom Truth Prosperity", ...openingFrames.map((frame) => `${frame.title} — ${frame.text}`), "Shikana Frontliners for Unity Party"];
  const activeFlip = sequence[flipIndex];

  return (
    <main className="overflow-hidden bg-[#fcfcfa] text-[#162443]">
      <CampaignPopup />

      <section className="relative isolate overflow-hidden bg-[#f5f0e8]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(212,161,42,0.24),_transparent_30%),linear-gradient(120deg,_rgba(18,32,61,0.75),_rgba(18,32,61,0.88))]" />
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80"
          alt="Shikana community members together"
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-60"
        />

        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-20">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex rounded-full border border-[#e8b94b] bg-[#d4a12a]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f6d374] backdrop-blur-sm">
              The People’s Movement
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5rem]">
              Tuambiane Ukweli,<br />
              <span className="text-[#f6d374]">Vile Inafaa</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
              Break the chains of division. Unite in the struggle for a sovereign, just and prosperous Kenya.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/shared-ui/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9232b] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a9161d]">
                Join Shikana <ArrowRight size={18} />
              </Link>
              <Link href="#agenda" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#162443]">
                Explore agenda
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#12203d]/70 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#f6d374]">
                <span>Discover Freedom Truth Prosperity</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-h-[230px] rounded-[1.5rem] bg-gradient-to-br from-[#d4a12a]/15 via-[#12203d]/20 to-[#12203d]/60 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f6d374]">Dynamic headline</p>
                <div className="mt-5 transition-all duration-700 ease-in-out">
                  <p className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">{activeFlip.split(" — ")[0]}</p>
                  <p className="mt-4 max-w-md text-base leading-7 text-white/80">{activeFlip.includes(" — ") ? activeFlip.split(" — ").slice(1).join(" — ") : "A shared national purpose and a common destiny for every Kenyan."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href="#agenda" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-[0.28em] text-white/80 sm:flex">
          Scroll to explore <ArrowDown size={16} />
        </a>
      </section>

      <section id="agenda" className="bg-[#f4f1ed] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#c9232b]">THE NATIONALIST AGENDA</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#162443] sm:text-5xl">
              A shared national purpose.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Before our differences of tribe, region, class, or creed, we are one people united by a common destiny.
              Shikana calls every Kenyan to embrace a shared national consciousness and participate in building an
              inclusive and prosperous nation founded on equality and solidarity.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {nationalPriorities.map((priority) => (
              <article key={priority.number} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_48px_-30px_rgba(15,23,42,0.8)]">
                <img src={priority.image} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-7">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c9232b]">{priority.number}</p>
                  <h3 className="mt-6 text-2xl font-black leading-tight text-[#162443]">{priority.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{priority.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="get-involved" className="relative z-10 mx-auto -mt-10 max-w-[1600px] px-4 sm:px-8">
        <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_60px_rgba(22,36,67,.14)] sm:grid-cols-2 lg:grid-cols-4">
          {actions.map(({ icon: Icon, title, copy, href }) => (
            <Link key={title} href={href} className="group border-b border-slate-100 p-6 transition hover:bg-[#162443] hover:text-white sm:p-7 lg:border-b-0 lg:border-r last:border-0">
              <Icon className="mb-7 text-[#c9232b] transition group-hover:scale-110 group-hover:text-white" size={27} />
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 transition group-hover:text-white/70">{copy}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#c9232b] group-hover:text-white">Explore <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f1f0eb] px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#c9232b]">OUR SHARED RESPONSIBILITY</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#162443] sm:text-5xl">The 5Cs</h2>
            </div>
            <p className="max-w-md leading-7 text-slate-600">
              We safeguard the collective interest of our Cultures, Communities, Constituencies, Counties and the Country.
            </p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {fiveCs.map((item, index) => (
              <div key={item} className="group rounded-[1.4rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#c9232b] hover:shadow-lg">
                <span className="text-sm font-black text-[#c9232b]">0{index + 1}</span>
                <h3 className="mt-12 text-2xl font-black text-[#162443]">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c9232b]">Upcoming Events</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#162443] sm:text-5xl">Something big is coming your way.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Be Where it Happens. An event where you can get involved, and make your voice count. Don’t miss!!!</p>
        </div>
        <EventsPreview />
      </section>

      <section className="bg-[#f5f1ea] px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 text-left">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c9232b]">Find a group near you</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#162443] sm:text-5xl">Build the movement where you live.</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_48px_-32px_rgba(15,23,42,0.8)]">
              <svg viewBox="0 0 760 620" className="h-[500px] w-full rounded-[1.4rem] bg-[#eef5ff]" role="img" aria-label="Kenya regional map">
                <path d="M260 80 L330 60 L430 96 L505 116 L575 220 L610 280 L595 380 L540 470 L470 540 L400 520 L315 470 L240 420 L180 290 L200 195 L260 80 Z" fill="#dfeaff" stroke="#0f172a" strokeWidth="4"/>
                <circle cx="355" cy="170" r="8" fill="#c9232b" />
                <circle cx="420" cy="220" r="8" fill="#c9232b" />
                <circle cx="480" cy="240" r="8" fill="#c9232b" />
                <circle cx="380" cy="300" r="8" fill="#c9232b" />
                <circle cx="440" cy="350" r="8" fill="#c9232b" />
                <circle cx="490" cy="410" r="8" fill="#c9232b" />
                <circle cx="360" cy="430" r="8" fill="#c9232b" />
                <circle cx="300" cy="260" r="8" fill="#c9232b" />
                <circle cx="515" cy="295" r="8" fill="#c9232b" />
                <circle cx="315" cy="170" r="8" fill="#c9232b" />
                <circle cx="445" cy="470" r="8" fill="#c9232b" />
                <circle cx="565" cy="350" r="8" fill="#c9232b" />
                <text x="290" y="170" fontSize="18" fontWeight="700" fill="#162443">Nairobi</text>
                <text x="530" y="240" fontSize="18" fontWeight="700" fill="#162443">North Rift</text>
                <text x="320" y="448" fontSize="18" fontWeight="700" fill="#162443">Coast</text>
                <text x="220" y="280" fontSize="18" fontWeight="700" fill="#162443">North Eastern</text>
                <text x="445" y="470" fontSize="18" fontWeight="700" fill="#162443">South Rift</text>
              </svg>
            </div>
            <div className="rounded-[1.8rem] bg-[#162443] p-7 text-white shadow-[0_18px_48px_-32px_rgba(15,23,42,0.8)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f6d374]">SCHEDULE XII: REGIONAL CHAPTERS</p>
              <div className="mt-6 space-y-4 text-sm leading-7 text-white/80">
                {[
                  "NAIROBI - Counties: Nairobi.",
                  "NORTH EASTERN - Counties: Marsabit, Wajir, Manders, Garissa.",
                  "CENTRAL EASTERN - Counties: Tharaka Nithi, Meru, Isiolo, Samburu.",
                  "SOUTH EASTERN - Counties: Machakos, Kitui, Makueni, Tana River.",
                  "COAST - Counties: Taita Taveta, Kwale, Mombasa, Kilifi, Lamu.",
                  "WESTERN - Counties: Vihiga, Kakamega, Busia, Bungoma, Trans Nzoia.",
                  "UPPER NYANZA - Counties: Kisumu, Siaya, Homa Bay.",
                  "LOWER NYANZA – Counties: Migori, Kisii, Nyamira.",
                  "NORTH RIFT VALLEY - Counties: Turkana, West Pokot, Elgeyo Marakwet.",
                  "CENTRAL RIFT – Counties: Nandi, Uasin Gishu, Baringo.",
                  "SOUTH RIFT VALLEY - Counties: Kajiado, Narok, Bomet, Kericho.",
                  "UPPER CENTRAL – Counties: Nakuru, Laikipia, Nyandarua.",
                  "LOWER CENTRAL - Counties: Nyeri, Kirinyaga, Embu, Muranga, Kiambu.",
                ].map((region) => (
                  <div key={region} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {region}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="bg-[#c9232b] px-5 py-24 text-white sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/75">Get involved</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">Be part of the movement for unity.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">Your voice and participation matter. Join Shikana or support its work today.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/shared-ui/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-[#c9232b] transition hover:bg-[#162443] hover:text-white">Join Shikana <ArrowRight size={18} /></Link>
            <Link href="/shared-ui/donate" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-7 py-4 font-bold transition hover:bg-white hover:text-[#c9232b]">Support the party <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <ImpactStoryHome />
    </main>
  );
}
