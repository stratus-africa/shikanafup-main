import { useSiteSettings } from "@/hooks/use-site-settings";
import { CONTENT_DEFAULTS } from "@/lib/cms/page-content";

/**
 * Reads editable page copy managed in Admin → Website → Pages.
 * Falls back to the built-in default whenever nothing is saved.
 */
export function usePageContent() {
  const { settings } = useSiteSettings();

  const c = (key: string, fallback?: string) => {
    const saved = settings?.[key];
    if (typeof saved === "string" && saved.trim()) return saved;
    return CONTENT_DEFAULTS[key] ?? fallback ?? "";
  };

  return { c };
}
