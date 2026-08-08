import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "@/components/admin/cms/page-editor";
import { CONTACT_PAGE } from "@/lib/cms/page-content";

export const Route = createFileRoute("/_authenticated/admin/ui/pages/contact")({
  ssr: false,
  component: () => <PageEditor page={CONTACT_PAGE} />,
  head: () => ({
    meta: [
      { title: "Contact Us Content | SFUP Admin" },
      { name: "description", content: "Edit the SFUP Contact Us hero copy and published contact details." },
      { property: "og:title", content: "Contact Us Content | SFUP Admin" },
      { property: "og:description", content: "Edit the SFUP Contact Us page content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
