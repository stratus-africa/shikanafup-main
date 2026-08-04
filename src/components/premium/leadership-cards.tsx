import { motion } from "motion/react";
import { Link } from "@/lib/next-shims";
import { ArrowRight } from "lucide-react";

const LEADERS = [
  { name: "Stephen Ogallo", title: "Party Leader & Chair", image: "/steve.jpeg" },
  { name: "Nancy Mutava", title: "Secretary General / Legal", image: "/nancy.jpeg" },
  { name: "Laura Ombok", title: "Treasurer / Corporate Strategy", image: "/laura.jpeg" },
  { name: "Emanuel Yeswa", title: "Organising Secretary", image: "/emmanuel.jpeg" },
  { name: "Philip Mwembi", title: "Publicity & Media Relations", image: "/phillip.jpeg" },
  { name: "Merceline Aol", title: "Women & Special Interest Leader", image: "/mercy.jpeg" },
];

export function LeadershipCards({ title }: { title: string }) {
  return (
    <section aria-labelledby="leadership-title" className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Leadership
            </p>
            <h2
              id="leadership-title"
              className="text-3xl font-black tracking-tight text-foreground md:text-4xl"
            >
              {title}
            </h2>
          </div>
          <Link
            href="/shared-ui/about#team"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Full team
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {LEADERS.map((l, i) => (
            <motion.li
              key={l.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="group overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={l.image}
                  alt={`${l.name}, ${l.title}`}
                  loading="lazy"
                  className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-bold text-foreground">{l.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{l.title}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
