import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Users, MapPin, Building2, HeartHandshake } from "lucide-react";

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduce]);

  return value;
}

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Users;
}

function StatCard({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const value = useCountUp(stat.value, active);
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
      <Icon className="relative mb-4 size-6 text-primary" aria-hidden="true" />
      <p className="relative text-3xl font-black tracking-tight text-foreground md:text-4xl">
        {value.toLocaleString()}
        {stat.suffix ?? "+"}
      </p>
      <p className="relative mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

export function StatCounters({
  members,
  branches,
  counties,
  volunteers,
}: {
  members: number;
  branches: number;
  counties: number;
  volunteers: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setActive(true),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stats: Stat[] = [
    { label: "Registered members", value: members, icon: Users },
    { label: "Active branches", value: branches, icon: Building2 },
    { label: "Counties covered", value: counties, suffix: "", icon: MapPin },
    { label: "Active volunteers", value: volunteers, icon: HeartHandshake },
  ];

  return (
    <section aria-labelledby="impact-stats" className="border-y border-border bg-muted/40 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <h2 id="impact-stats" className="sr-only">
          Movement in numbers
        </h2>
        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} active={active} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
