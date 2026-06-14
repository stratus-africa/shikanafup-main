"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Mailbox,
  ExternalLink,
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Quick Links */}
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white/80 hover:text-white">Home</Link></li>
              <li><Link href="/shared-ui/about" className="text-white/80 hover:text-white">About Us</Link></li>
              <li><Link href="/shared-ui/publications" className="text-white/80 hover:text-white">Publications</Link></li>
              {/* <li><Link href="/shared-ui/contact" className="text-white/80 hover:text-white">Contact</Link></li> */}
              <li><Link href="/shared-ui/terms" className="text-white/80 hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/shared-ui/privacy" className="text-white/80 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/shared-ui/faq" className="text-white/80 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Downloads */}
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-4">External Links</h3>
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
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shared-ui/register" className="text-white/80 hover:text-white">Become a Member</Link></li>
              <li><Link href="/shared-ui/political-position" className="text-white/80 hover:text-white">Become An Aspirant</Link></li>
              <li><Link href="/shared-ui/party-position" className="text-white/80 hover:text-white">Party Positions</Link></li>
              <li><Link href="/shared-ui/local-group" className="text-white/80 hover:text-white">Find Local Group</Link></li>
              <li><Link href="/shared-ui/volunteer" className="text-white/80 hover:text-white">Volunteer</Link></li>
              <li><Link href="/shared-ui/careers" className="text-white/80 hover:text-white">Careers</Link></li>
              <li><Link href="/shared-ui/donate" className="text-white/80 hover:text-white">Donate</Link></li>
              <li><Link href="/shared-ui/listings" className="text-white/80 hover:text-white">Shop</Link></li>

            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1" />
                <div>
                  <a href="mailto:info@shikana.co.ke" className="hover:text-white block">
                    info@shikana.co.ke
                  </a>
                  <a href="mailto:shikana@gmail.co.ke" className="hover:text-white block">
                    shikana@gmail.co.ke
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+254706357064" className="hover:text-white">
                  0738 030 398
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Mailbox size={16} className="mt-1" />
                <div>
                  <p>P.O BOX 18234 – 00100</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={22} className="mt-1 text-white" />
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold text-white">Kikinga House, Kiambu Road</p>
                  <p>Opposite Kiambu Referrals Hospital, Kiambu County</p>
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
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-4">Our Office</h3>
            <div className="rounded-lg overflow-hidden border border-white/20 h-[180px]">
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
        <div className="mt-4 pt-8">
          <div className="flex flex-wrap justify-between gap-8 md:gap-12">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
              <Facebook size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
              <Twitter size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Twitter / X</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
              <Instagram size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">Instagram</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
              <Youtube size={24} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-md">YouTube</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <p>&copy; {currentYear} Shikana Frontliners for Unity Party. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
