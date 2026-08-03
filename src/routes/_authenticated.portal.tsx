import { createFileRoute } from "@tanstack/react-router";
import { MemberPortal } from "@/components/member/member-portal";

export const Route = createFileRoute("/_authenticated/portal")({
  ssr: false,
  component: MemberPortal,
  head: () => ({
    meta: [
      { title: "My Membership Portal | SFUP" },
      {
        name: "description",
        content:
          "SFUP member portal: view your membership details and apply for party or volunteer positions.",
      },
      { property: "og:title", content: "My Membership Portal | SFUP" },
      {
        property: "og:description",
        content:
          "View your SFUP membership details and apply for party or volunteer positions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
