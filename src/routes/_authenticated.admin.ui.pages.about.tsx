import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "@/components/admin/cms/page-editor";
import { ABOUT_PAGE } from "@/lib/cms/page-content";

export const Route = createFileRoute("/_authenticated/admin/ui/pages/about")({
  ssr: false,
  component: () => <PageEditor page={ABOUT_PAGE} />,
  head: () => ({
    meta: [
      { title: "About Us Content | SFUP Admin" },
      { name: "description", content: "Edit the SFUP About Us hero, vision and mission content." },
      { property: "og:title", content: "About Us Content | SFUP Admin" },
      { property: "og:description", content: "Edit the SFUP About Us page content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
