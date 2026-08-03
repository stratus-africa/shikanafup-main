import { createFileRoute } from "@tanstack/react-router";
import { CmsManager } from "@/components/admin/cms/cms-manager";

export const Route = createFileRoute("/_authenticated/admin/ui/cms")({
  ssr: false,
  component: CmsManager,
  head: () => ({
    meta: [
      { title: "Content Management | SFUP Admin" },
      {
        name: "description",
        content:
          "Manage SFUP website content: homepage copy, FAQs and publications.",
      },
      { property: "og:title", content: "Content Management | SFUP Admin" },
      {
        property: "og:description",
        content: "Manage SFUP website copy, FAQs and publications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
