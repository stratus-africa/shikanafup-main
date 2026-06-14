"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu, X, Facebook, Twitter, Instagram, Youtube,
  Phone, Mail, Search
} from "lucide-react"
import { Button } from "./ui/button"
import { InfiniteSlider } from "./motion-primitives/infinite-slider"
import { useAuth } from "@/context/auth-context"
import { UserProfileDialog } from "./user-profile-dialog"
import { SearchDialog } from "./search-dialog"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const navItems = [
    { label: "Home", href: "/" },
    {
      label: "About",
      children: [
        { label: "What We Stand For", href: "/shared-ui/about#mission-vision" },
        { label: "Leadership", href: "/shared-ui/about#team" },
        { label: "Our Journey", href: "/shared-ui/about#timeline" },
      ],
    },
    { label: "Events", href: "/shared-ui/events" },
    {
      label: "Media",
      children: [
        { label: "News & Blogs", href: "/shared-ui/blog" },
        { label: "Publications", href: "/shared-ui/publications" },
      ],
    },

    {
      label: "Support Us",
      children: [
        { label: "Donate", href: "/shared-ui/donate" },
        { label: "Shop", href: "/shared-ui/listings" },
      ],
    },

    {
      label: "Get Involved",
      children: [
        { label: "Become a Member", href: "/shared-ui/register" },
        { label: "Become An Aspirant", href: "/shared-ui/political-position" },
        { label: "Internal Party Positions", href: "/shared-ui/party-position" },
        { label: "Find a Local Branch", href: "/shared-ui/local-group" },
        { label: "Volunteers", href: "/shared-ui/volunteer" },
        { label: "Careers", href: "/shared-ui/careers" },

      ],
    },

    {
      label: "Help Center",
      children: [
        { label: "Contact Us", href: "/shared-ui/contact" },
        { label: "FAQs", href: "/shared-ui/faq" },
      ],
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="w-full">
      {/*Top Info Bar*/}
      <div className="bg-secondary text-primary-foreground py-1">
        <InfiniteSlider gap={80} reverse>
          <p className="text-sm font-medium">Shikana Frontliners for Unity Party</p>
          <p className="text-sm font-medium">“Truth, Always, Conquers” - “Veritas, Lux et Lex, Vincit”</p>
          <p className="text-sm flex items-center gap-2"><Phone size={16} />0738 030 398</p>
          <p className="text-sm flex items-center gap-2"><Mail size={16} />info@shikana.co.ke</p>
          <div className="flex gap-4">
            <Facebook size={16} />
            <Twitter size={16} />
            <Instagram size={16} />
            <Youtube size={16} />
          </div>
        </InfiniteSlider>
      </div>

      {/* Main Navbar */}
      <nav
        className="bg-white border-b border-border sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-secondary">
              <img
                src="/SFU-LOGO.png"
                alt="SFUP Logo"
                className="h-18 w-18 object-contain"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-secondary text-md">
                  Shikana Frontliners for Unity Party
                </span>
                <span className="text-sm text-primary">
                  --- Truth, Always, Conquers ---
                </span>

              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {!item.children ? (
                    <Link
                      href={item.href}
                      className={`text-base font-medium transition-colors pb-1
            ${isActive(item.href)
                          ? "text-secondary border-b-2 border-secondary"
                          : "text-foreground hover:text-secondary"}
          `}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      {/* Parent button with highlight on hover */}
                      <button
                        className="text-base font-medium hover:text-secondary focus:outline-none focus:text-secondary relative"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {item.label}

                        {/* Optional small underline/highlight when open */}
                        <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </button>

                      {/* Dropdown card */}
                      <div
                        className="
              absolute left-1/2 transform -translate-x-1/2 top-full mt-4
              invisible opacity-0 translate-y-3
              group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300 ease-out
              bg-white border border-border rounded-lg shadow-lg w-56
              z-50
            "
                      >
                        {/* Triangle pointer */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-white rotate-45 border-l border-t border-border"></div>

                        {/* Dropdown links */}
                        <div className="py-2">
                          {item.children.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/10 focus:bg-secondary/10 focus:outline-none"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>


            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-5">
              {/* <Button
                onClick={() => router.push("/shared-ui/donate")}
                className="bg-secondary text-white hover:bg-secondary/90 transition-colors"
              >
                Donate
              </Button> */}

              {user ? (
                <button
                  onClick={() => setShowProfileDialog(true)}
                  className="h-9 w-9 rounded-full bg-secondary text-white font-bold flex items-center justify-center focus:ring-2 focus:ring-secondary"
                  aria-label="User profile"
                >
                  {user.first_name?.[0]?.toUpperCase()}
                </button>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Login
                </Button>
              )}

              <button
                onClick={() => setShowSearch(true)}
                aria-label="Search site"
                className="hover:text-secondary transition-colors"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden focus:outline-none focus:ring-2 focus:ring-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t pt-6 pb-4 space-y-5">

              {/* Navigation */}
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <span className="block text-base font-semibold text-foreground">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="block text-base font-semibold text-foreground hover:text-secondary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <div className="pl-4 mt-3 space-y-3">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block text-sm text-foreground/80"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Login / Profile */}
              {user ? (
                <button
                  onClick={() => {
                    setShowProfileDialog(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-md bg-secondary/10 text-secondary font-medium"
                >
                  My Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login")
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-primary text-white"
                >
                  Login
                </button>
              )}

              {/* Mobile Donate CTA */}
              {/* <Button
                onClick={() => router.push("/shared-ui/donate")}
                className="w-full bg-secondary text-white"
              >
                Donate
              </Button> */}
            </div>
          )}

        </div>
      </nav>

      <UserProfileDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  )
}
