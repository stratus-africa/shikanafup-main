import { useEffect, useState } from "react";

const ELECTION_DATE = new Date("2027-08-09T00:00:00+03:00").getTime();

function diff() {
  const d = Math.max(0, ELECTION_DATE - Date.now());
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export function IebcCountdownMini() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: [number, string][] = [
    [t.days, "Days"],
    [t.hours, "Hrs"],
    [t.minutes, "Min"],
    [t.seconds, "Sec"],
  ];

  return (
    <div className="w-full max-w-xs rounded-2xl bg-[#0f2f6b] p-5 text-white shadow-xl sm:max-w-sm">
      <p className="text-[11px] font-bold tracking-[0.16em] text-white/70">IEBC COUNTDOWN</p>
      <p className="mt-1 text-sm font-bold">2027 General Election</p>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {cells.map(([value, label]) => (
          <div key={label} className="rounded-lg bg-white/10 px-1 py-2">
            <p className="text-lg font-black tabular-nums sm:text-xl">{String(value).padStart(2, "0")}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/60">9 August 2027 · Register and verify your details.</p>
    </div>
  );
}
