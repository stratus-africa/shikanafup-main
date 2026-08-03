import type { NavItem, User } from "@/components/app-sidebar";

export const adminUser: User = {
  name: "Admin",
  email: "admin@sfup.org",
  avatar: "/placeholder-user.jpg",
};

export const adminNavMain: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: "dashboard" },
  { title: "Members", url: "/admin/ui/members", icon: "users" },
  { title: "Applications", url: "/admin/ui/applications", icon: "file-text" },
  { title: "Admin Users", url: "/admin/ui/admin-users", icon: "user-cog" },
  { title: "Donations", url: "/admin/ui/donations", icon: "hand-heart" },
  { title: "Events", url: "/admin/ui/events", icon: "calendar" },
  { title: "Local Groups", url: "/admin/ui/local-groups", icon: "users" },
  { title: "Blogs", url: "/admin/ui/blogs", icon: "file-text" },
  { title: "Jobs", url: "/admin/ui/jobs", icon: "briefcase" },
  { title: "Volunteers", url: "/admin/ui/volunteer", icon: "briefcase" },
  { title: "Aspirants", url: "/admin/ui/aspirants", icon: "briefcase" },
  { title: "Merchandise", url: "/admin/ui/merchandise", icon: "shopping-bag" },
  { title: "Reports", url: "/admin/ui/reports", icon: "scroll-text" },
  { title: "Audit Trail", url: "/admin/ui/audit-trails", icon: "scroll-text" },

];
