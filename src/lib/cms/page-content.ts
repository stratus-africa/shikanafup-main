// Central map of every editable piece of website copy.
// Keys are stored in the `settings` table and are prefixed with `site.` so the
// existing public settings reader picks them up automatically.

export type FieldKind = "text" | "textarea" | "image";

export interface ContentField {
  key: string;
  label: string;
  kind: FieldKind;
  default: string;
  help?: string;
}

export interface ContentSection {
  title: string;
  description?: string;
  fields: ContentField[];
}

export interface PageDefinition {
  slug: string;
  title: string;
  path: string;
  description: string;
  sections: ContentSection[];
}

const t = (
  key: string,
  label: string,
  def: string,
  kind: FieldKind = "text",
): ContentField => ({ key, label, kind, default: def });

export const HOME_PAGE: PageDefinition = {
  slug: "home",
  title: "Home Page",
  path: "/",
  description: "Hero slider, impact figures and newsletter call to action.",
  sections: [
    {
      title: "Hero slide 1",
      fields: [
        t("site.home.hero1_image", "Background image URL", "/Sfu-login-bg.avif", "image"),
        t("site.home.hero1_title", "Title", "Choose the Party that Chooses You"),
        t(
          "site.home.hero1_description",
          "Description",
          "Join a movement driven by the people, for the people - united in purpose, rising for progress, and building the future we all deserve.",
          "textarea",
        ),
      ],
    },
    {
      title: "Homepage hero copy",
      fields: [
        t("site.home.hero_eyebrow", "Eyebrow", "SHIKANA FRONTLINERS FOR UNITY PARTY"),
        t("site.home.hero_title", "Main heading", "Choose the party that chooses you."),
        t("site.home.hero_subtext", "Support text", "Break the chains of division. Unite in the struggle for a sovereign, just and prosperous Kenya."),
      ],
    },
    {
      title: "Hero slide 2",
      fields: [
        t("site.home.hero2_image", "Background image URL", "/sfu-image.jfif", "image"),
        t("site.home.hero2_title", "Title", "No One should be Left Behind"),
        t(
          "site.home.hero2_description",
          "Description",
          "Every Voice Counts, Every Choice Matters, Every Kenyan Must Move Forward and win Kenya’s future!",
          "textarea",
        ),
      ],
    },
    {
      title: "Hero slide 3",
      fields: [
        t("site.home.hero3_image", "Background image URL", "/unity-img.jpg", "image"),
        t("site.home.hero3_title", "Title", "We rise. we decide. We vote"),
        t(
          "site.home.hero3_description",
          "Description",
          "One Kenya. One Squad. A bold vision for tomorrow, powered by unity, driven by purpose, and built through progressive actions.",
          "textarea",
        ),
      ],
    },
    {
      title: "Hero buttons",
      fields: [
        t("site.home.cta_primary_label", "Primary button label", "Join the Movement"),
        t("site.home.cta_primary_href", "Primary button link", "/shared-ui/register"),
        t("site.home.cta_secondary_label", "Secondary button label", "Support Us Today"),
        t("site.home.cta_secondary_href", "Secondary button link", "/shared-ui/donate"),
      ],
    },
    {
      title: "Nothing About Kenyans section",
      fields: [
        t("site.home.nothing_heading", "Heading", "Nothing About Kenyans, Without Kenyans!"),
        t("site.home.nothing_subheading", "Subheading", "A practical vision for Kenya."),
        t("site.home.reason1_title", "Why us title", "Why Us"),
        t("site.home.reason1_text", "Why us text", "We are a party that listens to its members and empowers its people. Together, we will transform Kenya into a nation where freedom has meaning, opportunity is within reach, and where every citizen must belong and have a voice.", "textarea"),
        t("site.home.reason2_title", "Why you title", "Why You"),
        t("site.home.reason2_text", "Why you text", "Every Kenyan is a partner in governance, and the benefits of economic prosperity belong to all. Together, we must protect the nation, safeguard its natural resources, strengthen our institutions, and preserve the hopes of future generations.", "textarea"),
        t("site.home.shared_responsibility", "Shared responsibility label", "OUR SHARED RESPONSIBILITY"),
        t("site.home.shared_responsibility_text", "Shared responsibility text", "We safeguard the collective interest of our Cultures, Communities, Constituencies, Counties and the Country.", "textarea"),
        t("site.home.impact_card_title", "Impact card title", "Your Impact"),
        t("site.home.impact_card_text", "Impact card text", "Every action counts. Join thousands of Kenyans making a tangible difference in our nation's future.", "textarea"),
      ],
    },
    {
      title: "Impact section",
      fields: [
        t("site.home.impact_heading", "Heading", "Your Impact"),
        t(
          "site.home.impact_intro",
          "Intro paragraph",
          "Donations? Vital. Volunteering? Super. Showing up to events? Unmatched. From the donations that fuel our ground game to the volunteers who show up and show out - this movement is built different because of you. See how we’re winning together.",
          "textarea",
        ),
        t("site.home.impact1_stat", "Stat 1 figure", "50,000+"),
        t("site.home.impact1_label", "Stat 1 label", "Members Mobilized"),
        t("site.home.impact1_description", "Stat 1 description", "Active party members working toward our vision"),
        t("site.home.impact2_stat", "Stat 2 figure", "30"),
        t("site.home.impact2_label", "Stat 2 label", "Regions Reached"),
        t("site.home.impact2_description", "Stat 2 description", "Nationwide presence and grassroots engagement"),
        t("site.home.impact3_stat", "Stat 3 figure", "21+"),
        t("site.home.impact3_label", "Stat 3 label", "Events Organized"),
        t("site.home.impact3_description", "Stat 3 description", "Community events and civic engagement activities"),
        t("site.home.impact4_stat", "Stat 4 figure", "100%"),
        t("site.home.impact4_label", "Stat 4 label", "Transparent Spending"),
        t("site.home.impact4_description", "Stat 4 description", "Full accountability for all donations"),
      ],
    },
    {
      title: "Newsletter section",
      fields: [
        t("site.home.newsletter_heading", "Heading", "Stay Connected"),
        t(
          "site.home.newsletter_subtext",
          "Subtext",
          "Get updates, announcements, and exclusive content from Shikana Frontliners.",
          "textarea",
        ),
      ],
    },
  ],
};

export const ABOUT_PAGE: PageDefinition = {
  slug: "about",
  title: "About Us",
  path: "/shared-ui/about",
  description: "About hero, vision and mission content.",
  sections: [
    {
      title: "Hero",
      fields: [
        t("site.about.hero_image", "Background image URL", "/about-img.jpeg", "image"),
        t("site.about.hero_title", "Title", "About Us"),
        t(
          "site.about.hero_subtitle",
          "Subtitle",
          "Rooted in the vision of our founding members and guided by the unwavering commitment of the party leadership, we are committed to building a stronger, united nation through leadership defined by integrity, transparency, and accountability",
          "textarea",
        ),
      ],
    },
    {
      title: "Who we are",
      fields: [
        t("site.about.who_heading", "Who we are heading", "A political home built around people."),
        t("site.about.who_text1", "Paragraph 1", "We are building the next frontier of political power in our communities and throughout the country.", "textarea"),
        t("site.about.who_text2", "Paragraph 2", "Shikana Frontliners for Unity Party is rooted in the conviction that Kenya's future is strongest when citizens are informed, involved and represented.", "textarea"),
        t("site.about.story_heading", "Our story heading", "A movement shaped in community."),
        t("site.about.story_text", "Our story text", "Our journey began with listening. Through consultation with communities, we are creating a party whose priorities are grounded in the daily lives, hopes and ambitions of Kenyans.", "textarea"),
      ],
    },
    {
      title: "What we stand for",
      fields: [t("site.about.stand_heading", "Section heading", "What We Stand For")],
    },
    {
      title: "Our Vision",
      fields: [
        t("site.about.vision_heading", "Heading", "Our Vision"),
        t(
          "site.about.vision_text",
          "Vision statement",
          "To secure upright, safe and progressive communities by creating for them a prosperous socio-economic environment that guarantees equal opportunities for all Kenyans to reach their personal goals and collective aspirations.",
          "textarea",
        ),
        t("site.about.vision_point1", "Bullet 1", "Upright, safe and progressive communities"),
        t("site.about.vision_point2", "Bullet 2", "Prosperous socio-economic environment"),
        t("site.about.vision_point3", "Bullet 3", "Equal opportunities for all Kenyans"),
      ],
    },
    {
      title: "Our Mission",
      fields: [
        t("site.about.mission_heading", "Heading", "Our Mission"),
        t(
          "site.about.mission_text",
          "Mission statement",
          "To continue building a democratic social order that honors the completeness of the law and the absolute consciousness of the Kenyan people while being guided by divinity that shows us the way of life so that everyone can speak the truth in love and act in peace and unity as those who are going to be judged according to their works.",
          "textarea",
        ),
        t("site.about.mission_point1", "Bullet 1", "Democratic social order honoring the law"),
        t("site.about.mission_point2", "Bullet 2", "Guided by divinity and consciousness"),
        t("site.about.mission_point3", "Bullet 3", "Truth, love, peace and unity in action"),
      ],
    },
    {
      title: "Values and culture",
      fields: [
        t("site.about.values_heading", "Values heading", "A principled way forward."),
        t("site.about.values_intro", "Values intro", "Pursuant to Article 10 of the Constitution of Kenya, we pursue a just, morally upright and prosperous society founded on national and traditional values.", "textarea"),
        t("site.about.culture_heading", "Culture heading", "A place for Kenyans ready to change the nation in real time."),
        t("site.about.culture_text", "Culture text", "Our culture is centred on service, trust and practical participation—because a powerful movement starts with how we show up for one another.", "textarea"),
      ],
    },
  ],
};

export const CONTACT_PAGE: PageDefinition = {
  slug: "contact",
  title: "Contact Us",
  path: "/shared-ui/contact",
  description: "Contact hero copy and the contact details shown across the site.",
  sections: [
    {
      title: "Hero",
      fields: [
        t("site.contact.hero_image", "Background image URL", "/deer.gif", "image"),
        t("site.contact.hero_title", "Title", "Get in Touch"),
        t(
          "site.contact.hero_subtitle",
          "Subtitle",
          "History is written by those who dare speak. Bring your ideas, questions, and proposals, and join us in building a movement that reshapes our future.",
          "textarea",
        ),
      ],
    },
    {
      title: "Contact details",
      description: "Shown in the header, footer and on the contact page.",
      fields: [
        t("site.contact_email", "Primary email", "info@shikana.co.ke"),
        t("site.contact_email_alt", "Secondary email", "shikana@gmail.co.ke"),
        t("site.contact_phone", "Phone", "0738 030 398"),
        t("site.postal_address", "Postal address", "P.O BOX 18234 – 00100, Nairobi, Kenya"),
        t("site.physical_address", "Physical address", "Kikinga House, Kiambu Road"),
        t(
          "site.physical_address_line2",
          "Physical address (line 2)",
          "Opposite Kiambu Referrals Hospital, Kiambu County",
        ),
      ],
    },
  ],
};

export const PAGES: PageDefinition[] = [HOME_PAGE, ABOUT_PAGE, CONTACT_PAGE];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  PAGES.flatMap((p) => p.sections.flatMap((s) => s.fields.map((f) => [f.key, f.default]))),
);

export function getPage(slug: string) {
  return PAGES.find((p) => p.slug === slug);
}
