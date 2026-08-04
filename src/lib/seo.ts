// Route-level SEO: pulls CMS overrides in the loader, falls back to the
// per-page defaults declared in cms-pages.ts.
import { publicGetPageContent } from "@/lib/public/content.functions";
import { CMS_PAGE_MAP } from "@/lib/cms-pages";

export const SITE_URL = "https://shikana.co.ke";
export const SITE_NAME = "SHIKANA Frontliners for Unity Party";

export type SeoLoaderData = Record<string, string>;

export const seoLoader = (_pageKey: string) => async () => {
  try {
    return (await publicGetPageContent()) as SeoLoaderData;
  } catch {
    return {} as SeoLoaderData;
  }
};

function abs(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export const seoHead =
  (pageKey: string) =>
  ({ loaderData }: { loaderData?: SeoLoaderData }) => {
    const page = CMS_PAGE_MAP[pageKey];
    const cms = loaderData ?? {};
    const title = cms[`seo.${pageKey}.title`] || page?.seo.title || SITE_NAME;
    const description =
      cms[`seo.${pageKey}.description`] || page?.seo.description || "";
    const image = abs(cms[`seo.${pageKey}.image`] || page?.seo.image);
    const url = `${SITE_URL}${page?.path === "/" ? "" : (page?.path ?? "")}`;

    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:url", content: url },
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    const graph: unknown[] = [
      {
        "@type": page?.schema ?? "WebPage",
        "@id": `${url}#page`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${SITE_URL}#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}#org` },
      },
      {
        "@type": "PoliticalParty",
        "@id": `${SITE_URL}#org`,
        name: SITE_NAME,
        alternateName: "SFUP",
        url: SITE_URL,
        logo: `${SITE_URL}/SFU-LOGO.png`,
        slogan: "Truth, Always, Conquers",
        areaServed: "Kenya",
      },
    ];

    if (pageKey !== "home") {
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: page?.label ?? title, item: url },
        ],
      });
    }

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
        },
      ],
    };
  };
