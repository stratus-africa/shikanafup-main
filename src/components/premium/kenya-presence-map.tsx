import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";

interface Region {
  id: string;
  name: string;
  counties: number;
  branches: number;
  note: string;
  x: number; // % position on the map panel
  y: number;
}

const REGIONS: Region[] = [
  { id: "nairobi", name: "Nairobi Metro", counties: 3, branches: 62, note: "Ward committees in all 85 wards.", x: 58, y: 62 },
  { id: "coast", name: "Coast", counties: 6, branches: 38, note: "Fisherfolk and land-rights caucuses.", x: 76, y: 80 },
  { id: "western", name: "Western", counties: 4, branches: 34, note: "Cane farmers and youth enterprise hubs.", x: 26, y: 46 },
  { id: "nyanza", name: "Nyanza", counties: 6, branches: 41, note: "Lake economy and health access drives.", x: 20, y: 60 },
  { id: "rift", name: "Rift Valley", counties: 14, branches: 58, note: "Pastoralist and agri-value chain organising.", x: 40, y: 40 },
  { id: "central", name: "Mt Kenya", counties: 8, branches: 33, note: "Cooperative and produce-pricing clinics.", x: 60, y: 44 },
  { id: "eastern", name: "Lower Eastern", counties: 3, branches: 15, note: "Water and food-security programmes.", x: 70, y: 56 },
  { id: "north", name: "Northern Kenya", counties: 3, branches: 9, note: "Mobile registration and civic education.", x: 62, y: 20 },
];

export function KenyaPresenceMap({ title }: { title: string }) {
  const [activeId, setActiveId] = useState<string>(REGIONS[0]!.id);
  const active = REGIONS.find((r) => r.id === activeId)!;

  return (
    <section aria-labelledby="presence-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Nationwide
          </p>
          <h2
            id="presence-title"
            className="text-3xl font-black tracking-tight text-foreground md:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Select a region to see how the movement is organised on the ground.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Map panel */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/5 p-4">
            <div className="relative aspect-[4/3] w-full">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full text-primary/15"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M34 8 L70 12 L74 26 L84 40 L78 58 L86 74 L70 92 L44 88 L26 70 L14 56 L18 38 L26 22 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              </svg>

              {REGIONS.map((r) => {
                const isActive = r.id === activeId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActiveId(r.id)}
                    aria-pressed={isActive}
                    aria-label={`${r.name}: ${r.branches} branches across ${r.counties} counties`}
                    className="absolute grid min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? "size-5 bg-primary ring-4 ring-primary/25"
                          : "size-3 bg-secondary hover:size-4 hover:bg-primary"
                      }`}
                    />
                    <span className="pointer-events-none absolute top-full mt-1 whitespace-nowrap text-[10px] font-semibold text-foreground/70">
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                <h3 className="truncate text-xl font-black text-foreground">{active.name}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{active.note}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/60 p-4">
                  <dt className="text-xs font-medium text-muted-foreground">Counties</dt>
                  <dd className="text-2xl font-black text-foreground">{active.counties}</dd>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <dt className="text-xs font-medium text-muted-foreground">Branches</dt>
                  <dd className="text-2xl font-black text-foreground">{active.branches}</dd>
                </div>
              </dl>
            </motion.div>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="All regions">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(r.id)}
                    aria-pressed={r.id === activeId}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      r.id === activeId
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
