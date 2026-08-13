import { Link } from "@/lib/next-shims";
import { ArrowDown, ArrowRight, HeartHandshake, MapPinned, Users, Vote } from "lucide-react";
import { LatestNewsInsights } from "./latest-news-insights";
import { ImpactStoryHome } from "./impact-story-home";
import { CampaignPopup } from "./campaign-popup";
import { WhyUsWhyYou } from "./why-us-why-you";
import { DiscoverInterchange } from "./discover-interchange";
import { UpcomingEventsSection } from "./upcoming-events-section";
import { GenerationalTransformation } from "./generational-transformation";
import { ElectionCountdown } from "./election-countdown";

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

const nationalPriorities = [
  {
    number: "01",
    title: "A New Generation is Awakening",
    copy: "Kenya's youthful, connected and entrepreneurial population, together with the wisdom of older generations, can drive structural transformation, national renewal and shared progress.",
    image: "/unity-img.jpg",
  },
  {
    number: "02",
    title: "No One Should Be Left Behind",
    copy: "Revolution means opportunity for all and privilege for none. Progress is measured by whether development, dignity and opportunity reach every corner of Kenya.",
    image: "/about-image.jpg",
  },
  {
    number: "03",
    title: "We Rise. We Decide. We Vote.",
    copy: "Every citizen must find their voice. An informed, organised and active citizenry is essential to a Kenya built on accountability, participation and democratic renewal.",
    image: "/nairobiPicture.jpg",
  },
];

export function ShikanaHome() {
  return (
    <main className="overflow-hidden bg-[#fcfcfa] text-[#162443]">
      <CampaignPopup />

      <section className="relative isolate flex min-h-[calc(100svh-80px)] items-end overflow-hidden bg-[#162443] sm:items-center">
        <img
          src="/unity-img.jpg"
          alt="Shikana community members together"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101c35]/95 via-[#162443]/70 to-[#162443]/20" />
        <div className="mx-auto w-full max-w-[1600px] px-5 pb-24 pt-32 sm:px-8 sm:py-36">
          <p className="mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-white backdrop-blur-sm">
            SHIKANA FRONTLINERS FOR UNITY PARTY
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
            Choose the party that chooses you.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
            Break the chains of division. Unite in the struggle for a sovereign, just and prosperous Kenya.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shared-ui/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9232b] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a9161d] focus:outline-none focus:ring-4 focus:ring-white/40"
            >
              Join Shikana <ArrowRight size={18} />
            </Link>
            <Link
              href="#agenda"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#162443]"
            >
              Explore our agenda
            </Link>
          </div>
        </div>
        <a
          href="#get-involved"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-widest text-white/80 sm:flex"
        >
          SCROLL TO EXPLORE <ArrowDown size={16} />
        </a>
      </section>
      <section className="bg-[#f4f1ed] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[.16em] text-[#c9232b]">THE NATIONALIST AGENDA</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
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
              <article
                key={priority.number}
                className="group overflow-hidden bg-white shadow-[0_16px_40px_-30px_rgba(22,36,67,.55)]"
              >
                <img
                  src={priority.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-7">
                  <p className="text-xs font-black tracking-[.16em] text-[#c9232b]">{priority.number}</p>
                  <h3 className="mt-6 text-2xl font-black leading-tight">{priority.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{priority.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="get-involved" className="relative z-10 mx-auto -mt-10 max-w-[1600px] px-4 sm:px-8">
        <div className="grid overflow-hidden rounded-2xl shadow-[0_18px_60px_rgba(22,36,67,.14)] sm:grid-cols-2 lg:grid-cols-4">
          {actions.map(({ icon: Icon, title, copy, href }) => (
            <Link
              key={title}
              href={href}
              className="group border-b border-[#0f1929] bg-[#162443] text-white p-6 transition hover:bg-white hover:text-[#162443] sm:p-7 lg:border-b-0 lg:border-r last:border-0"
            >
              <Icon className="mb-7 text-white transition group-hover:scale-110 group-hover:text-[#c9232b]" size={27} />
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70 transition group-hover:text-slate-500">{copy}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-white group-hover:text-[#c9232b]">
                Explore <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-32">
        <div className="relative">
          <img
            src="/about-image.jpg"
            alt="Shikana members at a community gathering"
            className="h-[440px] w-full rounded-2xl object-cover shadow-xl sm:h-[540px]"
          />
          <div className="absolute -bottom-5 -right-3 max-w-[220px] rounded-xl bg-[#c9232b] p-6 text-white shadow-xl sm:-right-5">
            <p className="text-3xl font-black">Truth.</p>
            <p className="mt-1 text-sm font-medium">Always conquers.</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b]">WHO WE ARE</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Unity begins with the people.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Shikana Frontliners for Unity Party brings people together around a shared commitment to unity,
            participation and responsible public leadership.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            Our work is grounded in the belief that every Kenyan should have a meaningful stake in the country’s future.
          </p>
          <Link
            href="/shared-ui/about"
            className="mt-8 inline-flex items-center gap-2 font-bold text-[#c9232b] hover:gap-3"
          >
            Learn about Shikana <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <WhyUsWhyYou />
      <DiscoverInterchange />

      <ElectionCountdown />
      <section className="bg-[#f1f0eb] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12">
            <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b]">OUR SHARED RESPONSIBILITY</p>
            <p className="mt-4 text-xl leading-8 text-slate-700">
              We safeguard the collective interest of our Cultures, Communities, Constituencies, Counties and the
              Country.
            </p>
          </div>
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] sm:h-[600px] lg:h-[700px] bg-cover bg-center"
            style={{ backgroundImage: "url(/unity-img.jpg)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#162443]/90 via-[#162443]/70 to-[#162443]/50" />
            <div className="relative h-full flex items-center justify-center px-6 sm:px-12">
              <div className="max-w-2xl text-center text-white">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                  Discover • Freedom • Truth • Prosperity
                </h2>
                <p className="text-lg sm:text-xl leading-8 text-white/90">
                  Our collective commitment to building a Kenya rooted in shared values and national unity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LatestNewsInsights />

      <UpcomingEventsSection />

      <GenerationalTransformation />

      <section className="bg-[#162443] px-5 py-24 text-white sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 text-center lg:text-left">
            <p className="text-sm font-bold tracking-[0.16em] text-[#ecb23b] mb-4">JOIN THE MOVEMENT</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Get Inspired and Take Action.</h2>
            <p className="text-xl text-white/80 max-w-2xl mb-12">Do not allow others to decide your future for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/shared-ui/register"
              className="group bg-white/10 border border-white/30 rounded-2xl p-8 hover:bg-white hover:text-[#162443] transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#c9232b]">Join Shikana</h3>
              <p className="text-white/70 group-hover:text-slate-600 mb-6">
                Become a member and take your place in the movement.
              </p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Get Started <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              href="/shared-ui/volunteer"
              className="group bg-white/10 border border-white/30 rounded-2xl p-8 hover:bg-white hover:text-[#162443] transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#c9232b]">Become a Volunteer</h3>
              <p className="text-white/70 group-hover:text-slate-600 mb-6">
                Give your time and skills to build our nation.
              </p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Volunteer Now <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              href="/shared-ui/local-group"
              className="group bg-white/10 border border-white/30 rounded-2xl p-8 hover:bg-white hover:text-[#162443] transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#c9232b]">Get Involved</h3>
              <p className="text-white/70 group-hover:text-slate-600 mb-6">
                Connect with your local branch and take action.
              </p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Find Local Branch <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <ImpactStoryHome />
    </main>
  );
}
