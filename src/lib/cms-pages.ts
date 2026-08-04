// Shared definition of every public CMS-managed page.
// Used by the admin CMS editor, the public pages and the SEO helpers.

export type CmsFieldType = "text" | "textarea" | "url";

export interface CmsField {
  key: string; // stored as page.<page>.<key>
  label: string;
  type: CmsFieldType;
  default: string;
}

export interface CmsPage {
  key: string;
  label: string;
  path: string;
  schema: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage" | "FAQPage";
  seo: { title: string; description: string; image?: string };
  fields: CmsField[];
}

const f = (
  key: string,
  label: string,
  def: string,
  type: CmsFieldType = "text",
): CmsField => ({ key, label, type, default: def });

export const CMS_PAGES: CmsPage[] = [
  {
    key: "home",
    label: "Home",
    path: "/",
    schema: "WebPage",
    seo: {
      title: "SHIKANA Frontliners for Unity Party — Choose the Party that Chooses You",
      description:
        "SHIKANA Frontliners for Unity Party (SFUP) is a people-driven movement for unity, progress and inclusive governance across Kenya. Join the movement today.",
      image: "/unity-img.jpg",
    },
    fields: [
      f("hero_title", "Hero headline", "Choose the Party that Chooses You"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Join a movement driven by the people, for the people — united in purpose, rising for progress, and building the future we all deserve.",
        "textarea",
      ),
      f("hero_cta_primary", "Primary button label", "Join the Movement"),
      f("hero_cta_secondary", "Secondary button label", "Support Us Today"),
      f("stats_members", "Members counter", "48000"),
      f("stats_branches", "Branches counter", "290"),
      f("stats_counties", "Counties counter", "47"),
      f("stats_volunteers", "Volunteers counter", "5600"),
      f("manifesto_title", "Manifesto section title", "Our Manifesto Pillars"),
      f(
        "manifesto_intro",
        "Manifesto intro",
        "Six commitments that shape every policy we champion and every leader we field.",
        "textarea",
      ),
      f("leadership_title", "Leadership section title", "Meet Our Frontliners"),
      f("presence_title", "Presence section title", "Our Presence Across Kenya"),
      f("gallery_title", "Gallery section title", "Moments from the Movement"),
    ],
  },
  {
    key: "about",
    label: "About",
    path: "/shared-ui/about",
    schema: "AboutPage",
    seo: {
      title: "About SHIKANA — Our Mission, Vision and Leadership",
      description:
        "Discover what SHIKANA Frontliners for Unity Party stands for: our mission, vision, values, thematic areas, leadership team and journey so far.",
      image: "/about-image.jpg",
    },
    fields: [
      f("hero_title", "Hero headline", "What We Stand For"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Truth, always, conquers. A party built on integrity, inclusion and service to every Kenyan.",
        "textarea",
      ),
    ],
  },
  {
    key: "events",
    label: "Events",
    path: "/shared-ui/events",
    schema: "CollectionPage",
    seo: {
      title: "SHIKANA Events — Rallies, Town Halls and Community Meetings",
      description:
        "Find upcoming SHIKANA Frontliners for Unity Party events near you: rallies, town halls, branch meetings and community engagements across Kenya.",
      image: "/events-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Events & Gatherings"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Meet the movement in person — rallies, town halls and branch gatherings across all 47 counties.",
        "textarea",
      ),
    ],
  },
  {
    key: "blog",
    label: "News & Blogs",
    path: "/shared-ui/blog",
    schema: "CollectionPage",
    seo: {
      title: "News & Blogs — SHIKANA Frontliners for Unity Party",
      description:
        "Read the latest news, statements, opinion pieces and campaign updates from SHIKANA Frontliners for Unity Party.",
    },
    fields: [
      f("hero_title", "Hero headline", "News & Blogs"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Statements, stories and updates straight from the frontlines of the movement.",
        "textarea",
      ),
    ],
  },
  {
    key: "publications",
    label: "Publications",
    path: "/shared-ui/publications",
    schema: "CollectionPage",
    seo: {
      title: "Publications & Party Documents — SHIKANA",
      description:
        "Download the SHIKANA party constitution, manifesto, policy briefs, nomination rules and other official publications.",
      image: "/publication-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Publications"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Our constitution, manifesto and policy documents — open to every Kenyan.",
        "textarea",
      ),
    ],
  },
  {
    key: "donate",
    label: "Donate",
    path: "/shared-ui/donate",
    schema: "WebPage",
    seo: {
      title: "Donate to SHIKANA — Fund a People-Powered Movement",
      description:
        "Support SHIKANA Frontliners for Unity Party. Every contribution funds civic education, branch organising and grassroots mobilisation across Kenya.",
      image: "/donate-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Support Us Today"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Your contribution powers civic education, branch organising and grassroots mobilisation.",
        "textarea",
      ),
    ],
  },
  {
    key: "listings",
    label: "Shop",
    path: "/shared-ui/listings",
    schema: "CollectionPage",
    seo: {
      title: "SHIKANA Shop — Official Party Merchandise",
      description:
        "Wear the movement. Shop official SHIKANA Frontliners for Unity Party merchandise and support the campaign.",
      image: "/listing-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Official Merchandise"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Wear the movement. Every purchase supports our grassroots work.",
        "textarea",
      ),
    ],
  },
  {
    key: "register",
    label: "Become a Member",
    path: "/shared-ui/register",
    schema: "WebPage",
    seo: {
      title: "Become a Member — Join SHIKANA Frontliners for Unity Party",
      description:
        "Register as a member of SHIKANA Frontliners for Unity Party. Complete the online membership form and join a movement that chooses you.",
    },
    fields: [
      f("hero_title", "Hero headline", "Become a Member"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Membership is free, open and voluntary to every Kenyan of voting age.",
        "textarea",
      ),
    ],
  },
  {
    key: "political-position",
    label: "Become an Aspirant",
    path: "/shared-ui/political-position",
    schema: "WebPage",
    seo: {
      title: "Become an Aspirant — Run on the SHIKANA Ticket",
      description:
        "Apply to run for elective office on the SHIKANA Frontliners for Unity Party ticket. Learn the requirements and submit your aspirant application.",
    },
    fields: [
      f("hero_title", "Hero headline", "Become an Aspirant"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Step forward for elective office on a ticket built on truth and service.",
        "textarea",
      ),
    ],
  },
  {
    key: "party-position",
    label: "Internal Party Positions",
    path: "/shared-ui/party-position",
    schema: "WebPage",
    seo: {
      title: "Internal Party Positions — Serve Within SHIKANA",
      description:
        "Apply for internal SHIKANA party positions at branch, county and national level and help build the movement from within.",
    },
    fields: [
      f("hero_title", "Hero headline", "Internal Party Positions"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Serve the movement from within — branch, county and national roles.",
        "textarea",
      ),
    ],
  },
  {
    key: "local-group",
    label: "Find a Local Branch",
    path: "/shared-ui/local-group",
    schema: "WebPage",
    seo: {
      title: "Find a Local SHIKANA Branch Near You",
      description:
        "Locate or start a SHIKANA Frontliners for Unity Party branch in your ward, constituency or county and organise with neighbours.",
    },
    fields: [
      f("hero_title", "Hero headline", "Find a Local Branch"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Organise where you live — connect with the branch closest to you.",
        "textarea",
      ),
    ],
  },
  {
    key: "volunteer",
    label: "Volunteers",
    path: "/shared-ui/volunteer",
    schema: "WebPage",
    seo: {
      title: "Volunteer with SHIKANA — Give Your Time to the Movement",
      description:
        "Volunteer with SHIKANA Frontliners for Unity Party. Support voter outreach, civic education, digital campaigns and branch events.",
    },
    fields: [
      f("hero_title", "Hero headline", "Volunteer With Us"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Give your time, skills and voice to a movement that belongs to everyone.",
        "textarea",
      ),
    ],
  },
  {
    key: "careers",
    label: "Careers",
    path: "/shared-ui/careers",
    schema: "CollectionPage",
    seo: {
      title: "Careers at SHIKANA — Work for the Movement",
      description:
        "Explore open roles at SHIKANA Frontliners for Unity Party and build a career in organising, policy, communications and operations.",
      image: "/careers-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Careers"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Build your career while building the country.",
        "textarea",
      ),
    ],
  },
  {
    key: "contact",
    label: "Contact Us",
    path: "/shared-ui/contact",
    schema: "ContactPage",
    seo: {
      title: "Contact SHIKANA — Talk to the Party Secretariat",
      description:
        "Reach the SHIKANA Frontliners for Unity Party secretariat by phone, email or at our Kiambu Road offices in Nairobi, Kenya.",
    },
    fields: [
      f("hero_title", "Hero headline", "Contact Us"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Our secretariat is open to members, media and the public.",
        "textarea",
      ),
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    path: "/shared-ui/faq",
    schema: "FAQPage",
    seo: {
      title: "Frequently Asked Questions — SHIKANA",
      description:
        "Answers to common questions about SHIKANA membership, aspirant nominations, donations, branches and party governance.",
      image: "/faq-hero.png",
    },
    fields: [
      f("hero_title", "Hero headline", "Frequently Asked Questions"),
      f(
        "hero_subtitle",
        "Hero subtext",
        "Everything you need to know about joining and working with SHIKANA.",
        "textarea",
      ),
    ],
  },
];

export const CMS_PAGE_MAP: Record<string, CmsPage> = Object.fromEntries(
  CMS_PAGES.map((p) => [p.key, p]),
);

export function pageDefaults(pageKey: string): Record<string, string> {
  const page = CMS_PAGE_MAP[pageKey];
  if (!page) return {};
  return Object.fromEntries(page.fields.map((x) => [x.key, x.default]));
}
