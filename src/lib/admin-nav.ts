import type { NavItem, User } from "@/components/app-sidebar";

export const adminUser: User = {
  name: "Admin",
  email: "admin@sfup.org",
  avatar: "/placeholder-user.jpg",
};

export const adminNavMain: NavItem[] = [
  // Overview
  { title: "Dashboard", url: "/admin/dashboard", icon: "dashboard", group: "Overview" },

  // Membership
  { title: "Applications", url: "/admin/ui/applications", icon: "file-text", group: "Membership" },
  { title: "Members", url: "/admin/ui/members", icon: "users", group: "Membership" },
  { title: "Aspirants", url: "/admin/ui/aspirants", icon: "briefcase", group: "Membership" },
  { title: "Volunteers", url: "/admin/ui/volunteer", icon: "hand-heart", group: "Membership" },
  { title: "Local Groups", url: "/admin/ui/local-groups", icon: "users", group: "Membership" },

  // Engagement
  { title: "Events", url: "/admin/ui/events", icon: "calendar", group: "Engagement" },
  { title: "Donations", url: "/admin/ui/donations", icon: "hand-heart", group: "Engagement" },
  { title: "Jobs", url: "/admin/ui/jobs", icon: "briefcase", group: "Engagement" },
  { title: "Merchandise", url: "/admin/ui/merchandise", icon: "shopping-bag", group: "Engagement" },

  // Website
  { title: "Home Page", url: "/admin/ui/pages/home", icon: "folder", group: "Website" },
  { title: "About Us", url: "/admin/ui/pages/about", icon: "folder", group: "Website" },
  { title: "Contact Us", url: "/admin/ui/pages/contact", icon: "folder", group: "Website" },
  { title: "FAQs & Publications", url: "/admin/ui/cms", icon: "folder", group: "Website" },
  { title: "Blogs", url: "/admin/ui/blogs", icon: "file-text", group: "Website" },

  // Administration
  { title: "Reports", url: "/admin/ui/reports", icon: "scroll-text", group: "Administration" },
  { title: "Admin Users", url: "/admin/ui/admin-users", icon: "user-cog", group: "Administration" },
  { title: "Settings", url: "/admin/ui/settings", icon: "settings", group: "Administration" },
  { title: "Audit Trail", url: "/admin/ui/audit-trails", icon: "scroll-text", group: "Administration" },
];
