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
      <div className="bg-[#d4a12a] text-[#12203d]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#12203d]">
            <img src={get("site.logo_url")} alt={`${get("site.site_name")} logo`} className="h-12 w-12 object-contain" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-black text-[0.9rem] uppercase tracking-[0.18em]">{get("site.site_name")}</span>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#12203d]/75">{get("site.tagline")}</span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#12203d] lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <button className="transition hover:text-[#4a3110]">
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className="transition hover:text-[#4a3110]">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="h-9 w-9 rounded-full bg-[#12203d] text-white font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#12203d]"
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
              <>
                <Link
                  href="/shared-ui/donate"
                  className="hidden rounded-full border border-[#12203d]/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#12203d] transition hover:bg-[#12203d] hover:text-[#f6d374] sm:inline-flex"
                >
                  Support us
                </Link>
                <Link
                  href="/shared-ui/register"
                  className="inline-flex items-center justify-center rounded-full bg-[#12203d] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0b1327]"
                >
                  Join or log in
                </Link>
              </>
            )}

            <button
              onClick={() => setShowSearch(true)}
              aria-label="Search site"
              className="hidden transition-colors hover:text-[#4a3110] lg:inline-flex"
            >
              <Search size={18} />
            </button>

            <button
              className="lg:hidden focus:outline-none focus:ring-2 focus:ring-[#12203d]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-[#12203d]/10 bg-white px-5 py-6 lg:hidden">
          <div className="space-y-5">
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
                  <div className="mt-3 space-y-3 pl-4">
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

            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowProfileDialog(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-md bg-secondary/10 px-4 py-3 text-left font-medium text-secondary"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    router.push(isStaff ? "/admin/dashboard" : "/portal");
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-md bg-secondary/10 px-4 py-3 text-left font-medium text-secondary"
                >
                  {isStaff ? "Admin View" : "Dashboard"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-md bg-destructive/10 px-4 py-3 text-left font-medium text-destructive"
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
          </div>
        </div>
      )}

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
