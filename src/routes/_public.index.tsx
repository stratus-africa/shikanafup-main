import { createFileRoute } from "@tanstack/react-router";
import { ShikanaHome } from "@/components/shikana-home";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Shikana Frontliners for Unity Party" },
      { name: "description", content: "Official website of Shikana Frontliners for Unity Party." },
      { property: "og:title", content: "Shikana Frontliners for Unity Party" },
      { property: "og:description", content: "Official website of Shikana Frontliners for Unity Party." },
    ],
  }),
  component: ShikanaHome,
});
