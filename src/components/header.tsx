import { useEffect, useState } from "react";
import { Link, usePathname } from "@/lib/next-shims";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { SearchDialog } from "./search-dialog";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/shared-ui/about" },
  { label: "Manifesto", href: "/shared-ui/publications" },
  { label: "Leadership", href: "/shared-ui/about#team" },
  { label: "News", href: "/shared-ui/blog" },
  { label: "Events", href: "/shared-ui/events" },
  { label: "Contact", href: "/shared-ui/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { get } = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative z-50">
      <div className="hidden bg-secondary py-2 text-secondary-foreground sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span>Truth, Always, Conquers · Veritas, Lux et Lex, Vincit</span>
          <a className="transition-opacity hover:opacity-75" href={`mailto:${get("site.contact_email")}`}>
            {get("site.contact_email")}
          </a>
        </div>
      </div>
      <nav
        className={`sticky top-0 border-b transition-all duration-300 ${scrolled ? "border-border/70 bg-background/92 shadow-lg shadow-secondary/5 backdrop-blur-xl" : "border-transparent bg-background/98"}`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-4 sm:px-5">
          <Link
            href="/"
            aria-label="SHIKANA home"
            className="flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={get("site.logo_url")}
              alt={`${get("site.site_name")} logo`}
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-11" : "h-14"}`}
            />
            <span className="hidden max-w-[190px] border-l border-border pl-3 text-xs font-bold uppercase leading-tight tracking-[0.11em] text-secondary lg:block">
              {get("site.tagline")}
            </span>
          </Link>

          <div className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative py-3 text-sm font-bold transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-primary after:transition-transform ${pathname === item.href ? "text-primary after:scale-x-100" : "text-foreground/80 after:scale-x-0 hover:text-primary hover:after:scale-x-100"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search site"
            >
              <Search className="size-[18px]" />
            </button>
            <Link
              href="/shared-ui/register"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Join the movement <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl text-secondary lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-5 py-4 shadow-xl lg:hidden">
            <div className="mx-auto max-w-7xl">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-border/60 py-2 text-base font-bold text-foreground hover:text-primary"
                >
                  {item.label}
                  <ChevronDown className="size-4 -rotate-90" />
                </Link>
              ))}
              <Link
                href="/shared-ui/register"
                onClick={() => setOpen(false)}
                className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 font-bold text-primary-foreground"
              >
                Join the movement
              </Link>
            </div>
          </div>
        )}
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
