import { motion } from "motion/react";
import {
  Scale,
  GraduationCap,
  HeartPulse,
  Sprout,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

const PILLARS = [
  {
    icon: Scale,
    title: "Truth & Accountable Governance",
    body: "Open books, open offices. Public resources audited in the light, with leaders answerable to the people who elected them.",
  },
  {
    icon: Briefcase,
    title: "Jobs & Enterprise",
    body: "Backing the hustler, the farmer and the graduate with credit, markets and skills that turn effort into income.",
  },
  {
    icon: GraduationCap,
    title: "Education for Every Child",
    body: "Well-resourced classrooms, dignified teachers and technical pathways so no learner is priced out of their future.",
  },
  {
    icon: HeartPulse,
    title: "Health as a Right",
    body: "Functional local clinics, affordable cover and medicine on the shelf — from Turkana to Kwale.",
  },
  {
    icon: Sprout,
    title: "Land, Food & Climate",
    body: "Secure tenure, fair produce prices and climate-smart farming that keeps our soil and our households alive.",
  },
  {
    icon: ShieldCheck,
    title: "Inclusion & Dignity",
    body: "Women, youth, persons with disabilities and minorities at the decision table — not on the guest list.",
  },
];

export function ManifestoTiles({ title, intro }: { title: string; intro: string }) {
  return (
    <section aria-labelledby="manifesto-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Our commitments
          </p>
          <h2
            id="manifesto-title"
            className="text-3xl font-black tracking-tight text-foreground md:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{intro}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-within:-translate-y-1"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-4 grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
