
import { TrendingUp, Users, MapPin, Zap, Clock3 } from "lucide-react"
import { useEffect, useState } from "react";
import { AnimatedNumber } from '@/components/motion-primitives/animated-number';

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active party SFUP members.", description: "Building a broad, active movement for real civic participation." },
  { icon: MapPin, value: 30, suffix: "+", label: "Counties Reached", description: "Growing our footprint across the country, county by county." },
  { icon: TrendingUp, value: 290, suffix: "+", label: "Constituencies", description: "Reaching communities in every corner of Kenya." },
  { icon: Zap, value: 21, suffix: "+", label: "Activities Conducted", description: "Clear momentum, visible action, and growing public trust." },
]

export function ImpactStoryHome() {
  const [daysLeft, setDaysLeft] = useState({ years: 0, months: 0, weeks: 0, days: 0 });

  useEffect(() => {
    const electionDate = new Date("2027-08-09T00:00:00");
    const updateCountdown = () => {
      const now = new Date();
      const remaining = electionDate.getTime() - now.getTime();
      if (remaining <= 0) {
        setDaysLeft({ years: 0, months: 0, weeks: 0, days: 0 });
        return;
      }

      const totalDays = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const weeks = Math.floor((totalDays % 30) / 7);
      const days = totalDays % 7;
      setDaysLeft({ years, months, weeks, days });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#f7f3ee] py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="mb-12 text-left">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c9232b]">OUR JOURNEY IN NUMBERS</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#162443] sm:text-5xl">Growing stronger.<br />Building Momentum! Inspiring Action.</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-7 text-left shadow-[0_16px_40px_-30px_rgba(15,23,42,0.6)]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a12a]/15 text-[#d4a12a]">
                  <Icon size={28} />
                </div>
                <div className="inline-flex items-center gap-1 text-4xl font-black text-[#162443] md:text-5xl">
                  <AnimatedNumber value={stat.value} springOptions={{ bounce: 0, duration: 2000 }} />
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
                <p className="mt-4 text-lg font-bold text-[#162443]">{stat.label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[1.8rem] bg-[#162443] p-8 text-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.8)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f6d374]">Days to Election</p>
              <h3 className="mt-3 text-3xl font-black sm:text-4xl">Every milestone reflects the growing confidence that Kenyans have in SHIKANA.</h3>
              <p className="mt-4 text-base leading-7 text-white/70">Election Timelines — we can add the IEBC timelines.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-center text-[#162443]">
              {[
                { label: "Years", value: daysLeft.years },
                { label: "Months", value: daysLeft.months },
                { label: "Weeks", value: daysLeft.weeks },
                { label: "Days", value: daysLeft.days },
              ].map((item) => (
                <div key={item.label} className="min-w-[110px] rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-3xl font-black">{item.value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-[#f6d374]">
              <Clock3 size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.18em]">Transparent Spending</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-52 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-full rounded-full bg-[#d4a12a]" />
              </div>
              <span className="text-2xl font-black text-[#f6d374]">100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

