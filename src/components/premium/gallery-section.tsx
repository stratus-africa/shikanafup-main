import { useState } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const IMAGES = [
  { src: "/unity-img.jpg", caption: "One Kenya, one squad — county unity rally" },
  { src: "/nairobiPicture.jpg", caption: "Nairobi metro branch mobilisation" },
  { src: "/teamwork.jpg.jpeg", caption: "Volunteers preparing outreach kits" },
  { src: "/Harvest.jpg.jpeg", caption: "Farmer clinics on produce pricing" },
  { src: "/Servant.jpeg", caption: "Servant leadership in the community" },
  { src: "/sfu-image.jfif", caption: "Members at a town hall gathering" },
];

export function GallerySection({ title }: { title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : IMAGES[openIndex];

  return (
    <section aria-labelledby="gallery-title" className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Gallery</p>
          <h2
            id="gallery-title"
            className="text-3xl font-black tracking-tight text-foreground md:text-4xl"
          >
            {title}
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {IMAGES.map((img, i) => (
            <motion.li
              key={img.src}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block size-full overflow-hidden rounded-2xl border border-border/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Open image: ${img.caption}`}
              >
                <div className={i === 0 ? "aspect-square md:aspect-[4/3]" : "aspect-square"}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 text-left text-xs font-semibold text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {img.caption}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">{active?.caption ?? "Gallery image"}</DialogTitle>
          {active && (
            <figure>
              <img src={active.src} alt={active.caption} className="w-full rounded-lg" />
              <figcaption className="p-3 text-center text-sm text-muted-foreground">
                {active.caption}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
