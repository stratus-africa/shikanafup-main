import { ArrowRight, Check, ChevronRight, Heart, Lightbulb, Scale, Shield, Target, Users } from "lucide-react";
import { Image, Link } from "@/lib/next-shims";
import { usePageContent } from "@/hooks/use-page-content";
import { ThematicAreas } from "@/components/thematic-areas";
import { TeamSection } from "@/components/team-section";

const values = [
  "Limited Government",
  "Sovereignty of the People",
  "Respect to the Rule of Law",
  "Supremacy of Constitution",
  "National and Personal Security",
  "People's Consultative Assembly",
  "Personal and Collective Responsibility",
  "Strong Families and Caring Communities",
  "Equal Citizenship and Opportunities",
  "Informed Individual Choices",
  "Sustainable Development",
  "Loyalty to Country",
  "Competitive Enterprise",
  "Integrity and Accountability",
  "International Cooperation",
];

const culture = [
  { icon: Users, title: "Inclusive teamwork", text: "We believe in collaboration and diverse perspectives." },
  { icon: Lightbulb, title: "Innovation & impact", text: "We encourage creative thinking and meaningful contributions." },
  { icon: Shield, title: "Integrity", text: "We operate with transparency and ethical standards." },
  { icon: Heart, title: "Service mindset", text: "We're driven by the desire to serve our communities." },
];

const milestones = [
  ["2024", "Party formation", "Consultation with communities to design party strategies."],
  ["2025", "Party registration", "Registration of the party continues in earnest."],
  ["2026", "Party development", "National recruitment of party agents and member registration across all 47 counties."],
];

const points = (c: (key: string) => string, prefix: string) => [1, 2, 3].map((n) => c(`${prefix}_point${n}`)).filter(Boolean);

export function AboutProfile() {
  const { c } = usePageContent();
  const visionPoints = points(c, "site.about.vision");
  const missionPoints = points(c, "site.about.mission");
  const whoHeading = c("site.about.who_heading");
  const whoText1 = c("site.about.who_text1");
  const whoText2 = c("site.about.who_text2");
  const storyHeading = c("site.about.story_heading");
  const storyText = c("site.about.story_text");
  const valuesHeading = c("site.about.values_heading");
  const cultureHeading = c("site.about.culture_heading");
  const cultureText = c("site.about.culture_text");

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-[620px] sm:min-h-[680px]">
        <Image src={c("site.about.hero_image")} alt="Shikana community gathering" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondary/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1600px] flex-col justify-end px-5 pb-16 pt-32 sm:min-h-[680px] sm:px-8 sm:pb-20 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <Link href="/">Home</Link><ChevronRight className="size-3" /><span className="text-white">About Shikana</span>
          </nav>
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-white/75">Shikana Frontliners for Unity Party</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">{c("site.about.hero_title")}</h1>
            <p className="mt-7 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-white/90 sm:text-xl">{c("site.about.hero_subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12 lg:py-28">
        <div className="lg:col-span-4"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Who we are</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">{whoHeading}</h2></div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-2xl font-medium leading-snug text-secondary sm:text-3xl">{whoText1}</p>
          <div className="mt-8 grid gap-5 text-base leading-8 text-foreground/75 sm:grid-cols-2">
            <p>{whoText2}</p>
            <p>We engage young people, educate communities and empower the next generation of leadership so every Kenyan has a fair chance to thrive.</p>
          </div>
        </div>
      </section>

      <section id="timeline" className="bg-secondary py-8 sm:py-12">
        <div className="mx-auto grid max-w-[1600px] overflow-hidden bg-secondary sm:grid-cols-2">
          <div className="min-h-[360px] sm:min-h-[590px]"><Image src="/about-image.jpg" alt="Shikana members together" width={1200} height={1000} className="h-full w-full object-cover" /></div>
          <div className="flex items-center px-5 py-16 text-white sm:px-10 lg:px-16">
            <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/60">Our story</p><h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">{storyHeading}</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">{storyText}</p>
              <div className="mt-10 space-y-6 border-l border-white/25 pl-6">{milestones.map(([year, title, text]) => <div key={year}><p className="text-sm font-bold text-primary-foreground/60">{year}</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-white/65">{text}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission-vision" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{c("site.about.stand_heading")}</p><h2 className="mt-5 text-4xl font-bold text-secondary sm:text-5xl">The purpose that keeps us moving.</h2></div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Statement label="Vision" title={c("site.about.vision_heading")} text={c("site.about.vision_text")} points={visionPoints} image="/unity-img.jpg" imageAlt="Unity in the Shikana community" />
          <Statement label="Mission" title={c("site.about.mission_heading")} text={c("site.about.mission_text")} points={missionPoints} image="/teamwork.jpg.jpeg" imageAlt="Shikana collaboration" />
        </div>
      </section>

      <section className="bg-[#f4f1ed] py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="relative order-2 lg:order-1"><Image src="/nairobiPicture.jpg" alt="Nairobi, Kenya" width={1200} height={900} className="aspect-[4/3] w-full object-cover" /><div className="absolute -bottom-5 -right-3 bg-primary px-6 py-5 text-white sm:-right-5"><span className="block text-3xl font-bold">47</span><span className="text-xs font-semibold uppercase tracking-wider">Counties in view</span></div></div>
          <div className="order-1 lg:order-2"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Values</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">{valuesHeading}</h2><p className="mt-6 text-lg leading-8 text-foreground/75">{c("site.about.values_intro")}</p>
            <div className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">{values.map((value) => <div key={value} className="flex gap-3 border-t border-secondary/15 py-3 text-sm font-semibold text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{value}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Culture & community</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">{cultureHeading}</h2><p className="mt-6 text-lg leading-8 text-foreground/75">{cultureText}</p></div>
        <div className="mt-12 grid gap-px bg-secondary/15 sm:grid-cols-2 lg:grid-cols-4">{culture.map(({ icon: Icon, title, text }) => <div key={title} className="bg-background p-7"><Icon className="size-6 text-primary" /><h3 className="mt-8 text-xl font-bold text-secondary">{title}</h3><p className="mt-3 leading-7 text-foreground/70">{text}</p></div>)}</div>
      </section>

      <ThematicAreas />
      <div id="team" className="scroll-mt-24"><TeamSection /></div>

      <section className="bg-secondary px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Move with Shikana</p><h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">The future is not a spectator sport.</h2></div><div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link href="/documents/SHIKANA%20FRONTLINERS%20PARTY%20-%20IDEOLOGY.pdf" target="_blank" className="inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-4 text-sm font-bold transition hover:bg-white hover:text-secondary">Explore our ideology <ArrowRight className="size-4" /></Link><Link href="/shared-ui/register" className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold transition hover:bg-primary/85">Join Shikana <ArrowRight className="size-4" /></Link></div></div>
      </section>
    </main>
  );
}

function Statement({ label, title, text, points: statementPoints, image, imageAlt }: { label: string; title: string; text: string; points: string[]; image: string; imageAlt: string }) {
  return <article className="overflow-hidden border border-secondary/10 bg-white shadow-sm"><Image src={image} alt={imageAlt} width={1000} height={580} className="aspect-[16/9] w-full object-cover" /><div className="p-7 sm:p-9"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{label === "Vision" ? "V" : <Target className="size-4" />}</span><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{label}</p></div><h3 className="mt-5 text-3xl font-bold text-secondary">{title}</h3><p className="mt-5 leading-8 text-foreground/75">{text}</p><ul className="mt-7 space-y-3">{statementPoints.map((point) => <li key={point} className="flex items-start gap-3 text-sm font-medium text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{point}</li>)}</ul></div></article>;
}
import { ArrowRight, Check, ChevronRight, Heart, Lightbulb, Scale, Shield, Target, Users } from "lucide-react";
import { Image, Link } from "@/lib/next-shims";
import { usePageContent } from "@/hooks/use-page-content";
import { ThematicAreas } from "@/components/thematic-areas";
import { TeamSection } from "@/components/team-section";

const values = [
  "Limited Government",
  "Sovereignty of the People",
  "Respect to the Rule of Law",
  "Supremacy of Constitution",
  "National and Personal Security",
  "People's Consultative Assembly",
  "Personal and Collective Responsibility",
  "Strong Families and Caring Communities",
  "Equal Citizenship and Opportunities",
  "Informed Individual Choices",
  "Sustainable Development",
  "Loyalty to Country",
  "Competitive Enterprise",
  "Integrity and Accountability",
  "International Cooperation",
];

const culture = [
  { icon: Users, title: "Inclusive teamwork", text: "We believe in collaboration and diverse perspectives." },
  { icon: Lightbulb, title: "Innovation & impact", text: "We encourage creative thinking and meaningful contributions." },
  { icon: Shield, title: "Integrity", text: "We operate with transparency and ethical standards." },
  { icon: Heart, title: "Service mindset", text: "We're driven by the desire to serve our communities." },
];

const milestones = [
  ["2024", "Party formation", "Consultation with communities to design party strategies."],
  ["2025", "Party registration", "Registration of the party continues in earnest."],
  ["2026", "Party development", "National recruitment of party agents and member registration across all 47 counties."],
];

const points = (c: (key: string) => string, prefix: string) => [1, 2, 3].map((n) => c(`${prefix}_point${n}`)).filter(Boolean);

export function AboutProfile() {
  const { c } = usePageContent();
  const visionPoints = points(c, "site.about.vision");
  const missionPoints = points(c, "site.about.mission");

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-[620px] sm:min-h-[680px]">
        <Image src={c("site.about.hero_image")} alt="Shikana community gathering" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondary/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1600px] flex-col justify-end px-5 pb-16 pt-32 sm:min-h-[680px] sm:px-8 sm:pb-20 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <Link href="/">Home</Link><ChevronRight className="size-3" /><span className="text-white">About Shikana</span>
          </nav>
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-white/75">Shikana Frontliners for Unity Party</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">{c("site.about.hero_title")}</h1>
            <p className="mt-7 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-white/90 sm:text-xl">{c("site.about.hero_subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12 lg:py-28">
        <div className="lg:col-span-4"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Who we are</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">A political home built around people.</h2></div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-2xl font-medium leading-snug text-secondary sm:text-3xl">We are building the next frontier of political power in our communities and throughout the country.</p>
          <div className="mt-8 grid gap-5 text-base leading-8 text-foreground/75 sm:grid-cols-2">
            <p>Shikana Frontliners for Unity Party is rooted in the conviction that Kenya's future is strongest when citizens are informed, involved and represented.</p>
            <p>We engage young people, educate communities and empower the next generation of leadership so every Kenyan has a fair chance to thrive.</p>
          </div>
        </div>
      </section>

      <section id="timeline" className="bg-secondary py-8 sm:py-12">
        <div className="mx-auto grid max-w-[1600px] overflow-hidden bg-secondary sm:grid-cols-2">
          <div className="min-h-[360px] sm:min-h-[590px]"><Image src="/about-image.jpg" alt="Shikana members together" width={1200} height={1000} className="h-full w-full object-cover" /></div>
          <div className="flex items-center px-5 py-16 text-white sm:px-10 lg:px-16">
            <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/60">Our story</p><h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">A movement shaped in community.</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">Our journey began with listening. Through consultation with communities, we are creating a party whose priorities are grounded in the daily lives, hopes and ambitions of Kenyans.</p>
              <div className="mt-10 space-y-6 border-l border-white/25 pl-6">{milestones.map(([year, title, text]) => <div key={year}><p className="text-sm font-bold text-primary-foreground/60">{year}</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-white/65">{text}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission-vision" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{c("site.about.stand_heading")}</p><h2 className="mt-5 text-4xl font-bold text-secondary sm:text-5xl">The purpose that keeps us moving.</h2></div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Statement label="Vision" title={c("site.about.vision_heading")} text={c("site.about.vision_text")} points={visionPoints} image="/unity-img.jpg" imageAlt="Unity in the Shikana community" />
          <Statement label="Mission" title={c("site.about.mission_heading")} text={c("site.about.mission_text")} points={missionPoints} image="/teamwork.jpg.jpeg" imageAlt="Shikana collaboration" />
        </div>
      </section>

      <section className="bg-[#f4f1ed] py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="relative order-2 lg:order-1"><Image src="/nairobiPicture.jpg" alt="Nairobi, Kenya" width={1200} height={900} className="aspect-[4/3] w-full object-cover" /><div className="absolute -bottom-5 -right-3 bg-primary px-6 py-5 text-white sm:-right-5"><span className="block text-3xl font-bold">47</span><span className="text-xs font-semibold uppercase tracking-wider">Counties in view</span></div></div>
          <div className="order-1 lg:order-2"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Values</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">A principled way forward.</h2><p className="mt-6 text-lg leading-8 text-foreground/75">Pursuant to Article 10 of the Constitution of Kenya, we pursue a just, morally upright and prosperous society founded on national and traditional values.</p>
            <div className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">{values.map((value) => <div key={value} className="flex gap-3 border-t border-secondary/15 py-3 text-sm font-semibold text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{value}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Culture & community</p><h2 className="mt-5 text-4xl font-bold leading-tight text-secondary sm:text-5xl">A place for Kenyans ready to change the nation in real time.</h2><p className="mt-6 text-lg leading-8 text-foreground/75">Our culture is centred on service, trust and practical participation—because a powerful movement starts with how we show up for one another.</p></div>
        <div className="mt-12 grid gap-px bg-secondary/15 sm:grid-cols-2 lg:grid-cols-4">{culture.map(({ icon: Icon, title, text }) => <div key={title} className="bg-background p-7"><Icon className="size-6 text-primary" /><h3 className="mt-8 text-xl font-bold text-secondary">{title}</h3><p className="mt-3 leading-7 text-foreground/70">{text}</p></div>)}</div>
      </section>

      <ThematicAreas />
      <div id="team" className="scroll-mt-24"><TeamSection /></div>

      <section className="bg-secondary px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Move with Shikana</p><h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">The future is not a spectator sport.</h2></div><div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link href="/documents/SHIKANA%20FRONTLINERS%20PARTY%20-%20IDEOLOGY.pdf" target="_blank" className="inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-4 text-sm font-bold transition hover:bg-white hover:text-secondary">Explore our ideology <ArrowRight className="size-4" /></Link><Link href="/shared-ui/register" className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold transition hover:bg-primary/85">Join Shikana <ArrowRight className="size-4" /></Link></div></div>
      </section>
    </main>
  );
}

function Statement({ label, title, text, points: statementPoints, image, imageAlt }: { label: string; title: string; text: string; points: string[]; image: string; imageAlt: string }) {
  return <article className="overflow-hidden border border-secondary/10 bg-white shadow-sm"><Image src={image} alt={imageAlt} width={1000} height={580} className="aspect-[16/9] w-full object-cover" /><div className="p-7 sm:p-9"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{label === "Vision" ? "V" : <Target className="size-4" />}</span><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{label}</p></div><h3 className="mt-5 text-3xl font-bold text-secondary">{title}</h3><p className="mt-5 leading-8 text-foreground/75">{text}</p><ul className="mt-7 space-y-3">{statementPoints.map((point) => <li key={point} className="flex items-start gap-3 text-sm font-medium text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{point}</li>)}</ul></div></article>;
}
