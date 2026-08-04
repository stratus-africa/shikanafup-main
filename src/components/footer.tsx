import { Link } from "@/lib/next-shims";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Mailbox, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { get } = useSiteSettings();

  return (
    <footer className="relative overflow-hidden text-white" style={{ backgroundColor: "#162443" }}>
      <div className="pointer-events-none absolute -right-32 -top-32 size-[26rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-5 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/publications" className="text-white/80 hover:text-white">
                  Publications
                </Link>
              </li>
              {/* <li><Link href="/shared-ui/contact" className="text-white/80 hover:text-white">Contact</Link></li> */}
              <li>
                <Link href="/shared-ui/terms" className="text-white/80 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/privacy" className="text-white/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/faq" className="text-white/80 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">External Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.iebc.or.ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white inline-flex items-center gap-1"
                >
                  IEBC <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://orpp.or.ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white inline-flex items-center gap-1"
                >
                  ORPP <ExternalLink size={12} />
                </a>
              </li>

              {/* <li><Link href="/ideology" className="text-white/80 hover:text-white">Party Ideology</Link></li> */}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shared-ui/register" className="text-white/80 hover:text-white">
                  Become a Member
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/political-position" className="text-white/80 hover:text-white">
                  Become An Aspirant
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/party-position" className="text-white/80 hover:text-white">
                  Party Positions
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/local-group" className="text-white/80 hover:text-white">
                  Find Local Group
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/volunteer" className="text-white/80 hover:text-white">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/careers" className="text-white/80 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/donate" className="text-white/80 hover:text-white">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/shared-ui/listings" className="text-white/80 hover:text-white">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1" />
                <div>
                  <a href={`mailto:${get("site.contact_email")}`} className="hover:text-white block">
                    {get("site.contact_email")}
                  </a>
                  <a href={`mailto:${get("site.contact_email_alt")}`} className="hover:text-white block">
                    {get("site.contact_email_alt")}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href={`tel:${get("site.contact_phone").replace(/\s+/g, "")}`} className="hover:text-white">
                  {get("site.contact_phone")}
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Mailbox size={16} className="mt-1" />
                <div>
                  <p>{get("site.postal_address")}</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={22} className="mt-1 text-white" />
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold text-white">{get("site.physical_address")}</p>
                  <p>{get("site.physical_address_line2")}</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mailbox size={18} className="mt-1 text-white" />
                <div>
                  <p>Send a message</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">Our Office</h3>
            <div className="h-[180px] overflow-hidden rounded-2xl border border-white/20 shadow-xl shadow-black/10">
              <iframe
                title="Shikana Office Location"
                src="https://www.google.com/maps?q=Kikinga%20House%20Kiambu%20Road&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Social Media Row */}
        <div className="mt-14 border-t border-white/15 pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-5 md:gap-x-12">
            <a
              href={get("site.facebook_url")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
            >
              <Facebook size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Facebook</span>
            </a>
            <a
              href={get("site.twitter_url")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
            >
              <Twitter size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Twitter / X</span>
            </a>
            <a
              href={get("site.instagram_url")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
            >
              <Instagram size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Instagram</span>
            </a>
            <a
              href={get("site.youtube_url")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
            >
              <Youtube size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">YouTube</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/70 md:flex-row">
          <p>
            &copy; {currentYear} {get("site.site_name")}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/shared-ui/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/shared-ui/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
