import { useEffect, useState } from "react";
import { Link } from "@/lib/next-shims";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";

const SLIDE_DURATION = 7000;

const SLIDES = [
  { image: "/unity-img.jpg", alt: "Members marching together for a united Kenya" },
  { image: "/sfu-image.jfif", alt: "SHIKANA members at a community town hall" },
  { image: "/nairobiPicture.jpg", alt: "Nairobi skyline at dusk" },
];

export function PremiumHero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused || reduce) return;
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / SLIDE_DURATION) * 100, 100));
    }, 60);
    const timeout = setTimeout(
      () => setCurrent((p) => (p + 1) % SLIDES.length),
      SLIDE_DURATION,
    );
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [current, paused, reduce]);

  const slide = SLIDES[current]!;

  return (
    <section
      className="relative isolate flex min-h-[88vh] w-full items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      <div className="absolute inset-0 -z-10">
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={`size-full object-cover ${reduce ? "" : "animate-zoom"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/65 to-primary/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_20%,rgba(0,0,0,0.55))]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-background backdrop-blur">
            Veritas, Lux et Lex, Vincit
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-background md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-background/85 md:text-xl">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shared-ui/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
            >
              {ctaPrimary}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/shared-ui/donate"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-background/70 px-8 font-bold text-background transition-colors hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
            >
              {ctaSecondary}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => setCurrent((p) => (p === 0 ? SLIDES.length - 1 : p - 1))}
          aria-label="Previous slide"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-background/15 text-background backdrop-blur transition-colors hover:bg-background/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setCurrent((p) => (p + 1) % SLIDES.length)}
          aria-label="Next slide"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-background/15 text-background backdrop-blur transition-colors hover:bg-background/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-background/15 text-background backdrop-blur transition-colors hover:bg-background/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>

        <div className="flex min-w-0 flex-1 gap-2">
          {SLIDES.map((s, i) => (
            <div key={s.image} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-background/25">
              {i < current && <span className="absolute inset-0 bg-background" />}
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 bg-background transition-[width] duration-100"
                  style={{ width: reduce || paused ? "100%" : `${progress}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
