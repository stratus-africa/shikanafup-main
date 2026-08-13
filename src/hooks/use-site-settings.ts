import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publicGetSiteSettings } from "@/lib/public/content.functions";

export const SITE_DEFAULTS = {
  "site.logo_url": "/SFU-LOGO.png",
  "site.site_name": "Shikana Frontliners for Unity Party",
  "site.tagline": "--- Truth, Always, Conquers ---",
  "site.contact_email": "info@shikana.co.ke",
  "site.contact_email_alt": "shikana@gmail.co.ke",
  "site.contact_phone": "0738 030 398",
  "site.postal_address": "P.O BOX 18234 – 00100, Nairobi, Kenya",
  "site.physical_address": "Kikinga House, Kiambu Road",
  "site.physical_address_line2": "Opposite Kiambu Referrals Hospital, Kiambu County",
  "site.facebook_url": "https://facebook.com",
  "site.twitter_url": "https://twitter.com",
  "site.instagram_url": "https://instagram.com",
  "site.youtube_url": "https://youtube.com",
  "campaign_popup.enabled": "true",
  "campaign_popup.image_url": "/Sfu-login-bg.avif",
  "campaign_popup.title": "We Rise. We Decide. We Vote.",
  "campaign_popup.body": "Register to vote, verify your details and take your place in shaping Kenya's future.",
  "campaign_popup.primary_cta_label": "Check your voting details",
  "campaign_popup.primary_cta_url": "https://verify.iebc.or.ke/",
  "campaign_popup.secondary_cta_label": "Continue to site",
  "campaign_popup.dismiss_hours": "24",
} as const;

export type SiteSettingKey = keyof typeof SITE_DEFAULTS;

export function useSiteSettings() {
  const load = useServerFn(publicGetSiteSettings);
  const { data } = useQuery({
    queryKey: ["public", "site-settings"],
    queryFn: () => load(),
    staleTime: 5 * 60 * 1000,
  });

  const get = (key: SiteSettingKey) => (data?.[key] && String(data[key]).trim()) || SITE_DEFAULTS[key];

  return { get, settings: data ?? {} };
}
