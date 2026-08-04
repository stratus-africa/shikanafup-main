import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publicGetPageContent } from "@/lib/public/content.functions";
import { CMS_PAGE_MAP } from "@/lib/cms-pages";

/** Reads CMS-managed copy for a page, falling back to the built-in defaults. */
export function usePageContent(pageKey: string) {
  const load = useServerFn(publicGetPageContent);
  const { data } = useQuery({
    queryKey: ["public", "page-content"],
    queryFn: () => load(),
    staleTime: 5 * 60 * 1000,
  });

  const page = CMS_PAGE_MAP[pageKey];

  const get = (field: string, fallback = "") => {
    const stored = data?.[`page.${pageKey}.${field}`];
    if (stored && String(stored).trim()) return String(stored);
    const def = page?.fields.find((f) => f.key === field)?.default;
    return def ?? fallback;
  };

  const num = (field: string, fallback = 0) => {
    const n = Number(String(get(field)).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  return { get, num, content: data ?? {} };
}
