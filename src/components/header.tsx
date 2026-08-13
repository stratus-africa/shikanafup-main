import { useEffect, useState } from "react";
import { Link } from "@/lib/next-shims";
import { usePathname, useRouter } from "@/lib/next-shims";
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Search,
  User as UserIcon,
  LayoutDashboard,
  Shield,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { InfiniteSlider } from "./motion-primitives/infinite-slider";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileDialog } from "./user-profile-dialog";
import { SearchDialog } from "./search-dialog";
import { useSiteSettings } from "@/hooks/use-site-settings";

const STAFF_ROLES = ["super_admin", "admin", "editor", "moderator"];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { get } = useSiteSettings();

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setIsStaff(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!active) return;
        setIsStaff((data ?? []).some((r: any) => STAFF_ROLES.includes(r.role)));
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

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
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full shadow-[0_6px_24px_-20px_rgba(10,25,47,.45)]">
      {/*Top Info Bar*/}
      <div className="bg-secondary py-1 text-primary-foreground">
        <InfiniteSlider gap={80} reverse>
          <p className="text-sm font-medium">{get("site.site_name")}</p>
          <p className="text-sm font-medium">“Truth, Always, Conquers” - “Veritas, Lux et Lex, Vincit”</p>
          <p className="text-sm flex items-center gap-2">
            <Phone size={16} />
            {get("site.contact_phone")}
          </p>
          <p className="text-sm flex items-center gap-2">
            <Mail size={16} />
            {get("site.contact_email")}
          </p>
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
        className="border-b border-secondary/10 bg-white shadow-[0_6px_24px_-20px_rgba(10,25,47,.45)] backdrop-blur"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex h-[76px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-secondary">
              <img
                src={get("site.logo_url")}
                alt={`${get("site.site_name")} logo`}
                className="h-14 w-14 object-contain"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-secondary text-md">{get("site.site_name")}</span>
                <span className="text-sm text-primary">{get("site.tagline")}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {!item.children ? (
                    <Link
                      href={item.href}
                      className={`text-base font-medium transition-colors pb-1
            ${
              isActive(item.href)
                ? "text-secondary border-b-2 border-secondary"
                : "text-foreground hover:text-secondary"
            }
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
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-9 w-9 rounded-full bg-secondary text-white font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary"
                      aria-label="Account menu"
                    >
                      {(user.first_name?.[0] ?? user.email?.[0])?.toUpperCase()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {[user.first_name, user.last_name].filter(Boolean).join(" ") || "My account"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                      <UserIcon className="mr-2 h-4 w-4" /> My Profile
                    </DropdownMenuItem>
                    {isStaff ? (
                      <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                        <Shield className="mr-2 h-4 w-4" /> Admin View
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push("/portal")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AccountCta
                  onRegister={() => router.push("/shared-ui/register")}
                  onLogin={() => router.push("/login")}
                />
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
              className="lg:hidden focus:outline-none focus:ring-2 focus:ring-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div id="mobile-navigation" className="lg:hidden border-t pt-6 pb-4 space-y-5">
              {/* Navigation */}
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <span className="block text-base font-semibold text-foreground">{item.label}</span>
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
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowProfileDialog(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-md bg-secondary/10 text-secondary font-medium"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push(isStaff ? "/admin/dashboard" : "/portal");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-md bg-secondary/10 text-secondary font-medium"
                  >
                    {isStaff ? "Admin View" : "Dashboard"}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-md bg-destructive/10 text-destructive font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <AccountCta
                  fullWidth
                  onRegister={() => {
                    router.push("/shared-ui/register");
                    setIsMenuOpen(false);
                  }}
                  onLogin={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                />
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
  );
}

function AccountCta({
  onRegister,
  onLogin,
  fullWidth = false,
}: {
  onRegister: () => void;
  onLogin: () => void;
  fullWidth?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={`${fullWidth ? "w-full" : ""} bg-primary text-white hover:bg-[#9a181c]`}>
          <UserPlus className="size-4" /> Join or log in
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="px-2 py-2 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
          Your Shikana account
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={onRegister} className="cursor-pointer px-3 py-3">
          <UserPlus className="mr-3 size-4 text-primary" />
          <span>
            <span className="block font-semibold">Join Shikana</span>
            <span className="block text-xs text-muted-foreground">Become a member</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogin} className="cursor-pointer px-3 py-3">
          <UserIcon className="mr-3 size-4 text-secondary" />
          <span>
            <span className="block font-semibold">Log in</span>
            <span className="block text-xs text-muted-foreground">Access your account</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
