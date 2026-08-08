import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "@/components/admin/cms/page-editor";
import { HOME_PAGE } from "@/lib/cms/page-content";

export const Route = createFileRoute("/_authenticated/admin/ui/pages/home")({
  ssr: false,
  component: () => <PageEditor page={HOME_PAGE} />,
  head: () => ({
    meta: [
      { title: "Home Page Content | SFUP Admin" },
      { name: "description", content: "Edit the SFUP home page hero, impact figures and newsletter copy." },
      { property: "og:title", content: "Home Page Content | SFUP Admin" },
      { property: "og:description", content: "Edit the SFUP home page content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
