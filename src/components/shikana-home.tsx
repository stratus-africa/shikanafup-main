import { Link } from "@/lib/next-shims";
import { ArrowDown, ArrowRight, HeartHandshake, MapPinned, Users, Vote, TrendingUp, Zap } from "lucide-react";
import { usePageContent } from "@/hooks/use-page-content";
import { LatestNewsInsights } from "./latest-news-insights";
import { CampaignPopup } from "./campaign-popup";
import { GenerationalTransformation } from "./generational-transformation";
import { IebcCountdownMini } from "./iebc-countdown-mini";

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
  const { c } = usePageContent();
  const heroEyebrow = c("site.home.hero_eyebrow");
  const heroTitle = c("site.home.hero_title");
  const heroSubtext = c("site.home.hero_subtext");
  const primaryCtaLabel = c("site.home.cta_primary_label");
  const primaryCtaHref = c("site.home.cta_primary_href");
  const secondaryCtaLabel = c("site.home.cta_secondary_label");
  const secondaryCtaHref = c("site.home.cta_secondary_href");
  const nothingTitle = c("site.home.nothing_heading");
  const nothingSubheading = c("site.home.nothing_subheading");
  const reason1Title = c("site.home.reason1_title");
  const reason1Text = c("site.home.reason1_text");
  const reason2Title = c("site.home.reason2_title");
  const reason2Text = c("site.home.reason2_text");
  const sharedResponsibility = c("site.home.shared_responsibility");
  const sharedResponsibilityText = c("site.home.shared_responsibility_text");
  const impactCardTitle = c("site.home.impact_card_title");
  const impactCardText = c("site.home.impact_card_text");

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
            {heroEyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
            {heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">{heroSubtext}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9232b] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a9161d] focus:outline-none focus:ring-4 focus:ring-white/40"
            >
              {primaryCtaLabel} <ArrowRight size={18} />
            </Link>
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#162443]"
            >
              {secondaryCtaLabel}
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
      <section
        id="get-involved"
        className="relative z-10 mx-auto -mt-10 max-w-[1600px] px-4 sm:px-8 pb-20 sm:pb-24 lg:pb-28"
      >
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

      {/* Combined WhyUsWhyYou + ImpactStoryHome Section */}
      <section className="bg-[#162443] px-5 py-16 sm:px-8 md:py-24 lg:py-32 text-white">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
            {/* Left Column - WhyUsWhyYou Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-10 lg:mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
                  {nothingTitle}
                </h2>
                <p className="text-sm font-bold tracking-[0.16em] text-[#ecb23b] mt-6">{nothingSubheading}</p>
              </div>

              <div className="grid gap-6 sm:gap-8">
                {[
                  {
                    id: 1,
                    title: reason1Title,
                    content: reason1Text,
                  },
                  {
                    id: 2,
                    title: reason2Title,
                    content: reason2Text,
                  },
                ].map((card) => (
                  <div
                    key={card.id}
                    className="group bg-[#162443] border-2 border-[#162443] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-white hover:text-[#162443] hover:border-white hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                  >
                    <h3 className="text-xl sm:text-2xl font-black mb-4 transition-colors duration-300">{card.title}</h3>
                    <p className="text-base leading-7 text-white/80 group-hover:text-slate-600 transition-colors duration-300">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Shared Responsibility and Impact */}
            <div className="flex flex-col justify-center">
              <div className="mb-10 lg:mb-12">
                <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b]">{sharedResponsibility}</p>
                <p className="mt-4 text-lg leading-8 text-white">{sharedResponsibilityText}</p>
              </div>

              {/* Your Impact Card */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] bg-cover bg-center mb-8"
                style={{ backgroundImage: "url(/unity-img.jpg)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#162443]/90 via-[#162443]/70 to-[#162443]/50" />
                <div className="relative h-full flex items-center justify-center px-6 sm:px-12">
                  <div className="max-w-2xl text-center text-white">
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                      {impactCardTitle}
                    </h3>
                    <p className="text-base sm:text-lg leading-7 text-white/90">{impactCardText}</p>
                  </div>
                </div>
              </div>

              {/* Pill Navigation Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                <button className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs uppercase tracking-[0.08em] transition-all duration-300 bg-[#162443] text-white border-2 border-white hover:bg-white hover:text-[#162443]">
                  Discover
                </button>
                <button className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs uppercase tracking-[0.08em] transition-all duration-300 bg-white text-[#162443] border-2 border-white hover:bg-[#162443] hover:text-white">
                  Freedom
                </button>
                <button className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs uppercase tracking-[0.08em] transition-all duration-300 bg-white text-[#162443] border-2 border-white hover:bg-[#162443] hover:text-white">
                  Truth
                </button>
                <button className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs uppercase tracking-[0.08em] transition-all duration-300 bg-white text-[#162443] border-2 border-white hover:bg-[#162443] hover:text-white">
                  Prosperity
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GenerationalTransformation />

      <LatestNewsInsights />

      <section className="bg-[#d9b75a] px-5 py-24 text-[#162443] sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b] mb-4">JOIN THE MOVEMENT</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Get Inspired and Take Action.</h2>
              <p className="text-xl text-[#162443]/75 max-w-2xl">Do not allow others to decide your future for you.</p>
            </div>
            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
              <IebcCountdownMini />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/shared-ui/register"
              className="group rounded-2xl border border-white/20 bg-[#162443] p-8 text-white transition-all duration-300 hover:scale-105 hover:bg-[#1d3158]"
            >
              <h3 className="mb-4 text-2xl font-bold text-[#c9232b]">Join Shikana</h3>
              <p className="mb-6 text-white/75">Become a member and take your place in the movement.</p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Get Started <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              href="/shared-ui/volunteer"
              className="group rounded-2xl border border-white/20 bg-[#162443] p-8 text-white transition-all duration-300 hover:scale-105 hover:bg-[#1d3158]"
            >
              <h3 className="mb-4 text-2xl font-bold text-[#c9232b]">Become a Volunteer</h3>
              <p className="mb-6 text-white/75">Give your time and skills to build our nation.</p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Volunteer Now <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              href="/shared-ui/local-group"
              className="group rounded-2xl border border-white/20 bg-[#162443] p-8 text-white transition-all duration-300 hover:scale-105 hover:bg-[#1d3158]"
            >
              <h3 className="mb-4 text-2xl font-bold text-[#c9232b]">Get Involved</h3>
              <p className="mb-6 text-white/75">Connect with your local branch and take action.</p>
              <span className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Find Local Branch <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
