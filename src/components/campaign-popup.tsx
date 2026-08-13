import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "@/lib/next-shims";
import votingCampaign from "@/assets/shikana-vote-campaign.jpg.asset.json";

const STORAGE_KEY = "shikana-campaign-popup-dismissed";
const SHOW_FREQUENCY_HOURS = 24; // Show every 24 hours

export function CampaignPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60);

      // Only show if enough time has passed
      if (hoursPassed < SHOW_FREQUENCY_HOURS) return;
    }

    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shikana voting campaign"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black"
        >
          <X size={18} />
        </button>
        <img
          src={votingCampaign.url}
          alt="Shikana Frontliners for Unity Party campaign: We Rise, We Decide, We Vote. Register to vote and verify your details at verify.iebc.or.ke."
          className="block max-h-[78vh] w-full object-contain"
        />
        <div className="flex flex-col gap-2 p-4 sm:flex-row">
          <a
            href="https://verify.iebc.or.ke/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-[#162443] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0f1a31]"
          >
            Check your voting details
          </a>
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Continue to site
          </button>
        </div>
      </div>
    </div>
  );
}
