import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "@/lib/next-shims";
import { useSiteSettings } from "@/hooks/use-site-settings";
import votingCampaign from "@/assets/shikana-vote-campaign.jpg.asset.json";

const STORAGE_KEY = "shikana-campaign-popup-dismissed";

export function CampaignPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { get } = useSiteSettings();

  const isEnabled = String(get("campaign_popup.enabled") ?? "true").toLowerCase() !== "false";
  const imageUrl = get("campaign_popup.image_url") || votingCampaign.url;
  const title = get("campaign_popup.title") || "We Rise. We Decide. We Vote.";
  const body =
    get("campaign_popup.body") ||
    "Register to vote, verify your details and take your place in shaping Kenya's future.";
  const primaryCtaLabel = get("campaign_popup.primary_cta_label") || "Check your voting details";
  const primaryCtaUrl = get("campaign_popup.primary_cta_url") || "https://verify.iebc.or.ke/";
  const secondaryCtaLabel = get("campaign_popup.secondary_cta_label") || "Continue to site";
  const showFrequencyHours = Number(get("campaign_popup.dismiss_hours") || "24");

  useEffect(() => {
    if (typeof window === "undefined" || !isEnabled) return;

    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60);

      if (hoursPassed < showFrequencyHours) return;
    }

    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname, isEnabled, showFrequencyHours]);

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

  if (!isEnabled || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
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

        <div className="bg-slate-50 p-4 pb-0">
          <img src={imageUrl} alt={title} className="block max-h-[62vh] w-full rounded-xl object-cover" />
        </div>

        <div className="space-y-3 p-4">
          <h3 className="text-xl font-black text-[#162443]">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{body}</p>
        </div>

        <div className="flex flex-col gap-2 p-4 pt-0 sm:flex-row">
          <a
            href={primaryCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-[#162443] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0f1a31]"
          >
            {primaryCtaLabel}
          </a>
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            {secondaryCtaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
