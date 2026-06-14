"use client"

import * as React from "react"
// Tabler icon import removed

import {
  Users,
  UserCog,
  Calendar,
  FileText,
  Briefcase,
  ShoppingBag,
  ScrollText,
  FolderOpen,
  HandHeart,
  FolderMinus,
  LayoutDashboard,
} from "lucide-react"
import { Roles } from "@/lib/roles"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  "user-cog": UserCog,
  calendar: Calendar,
  "file-text": FileText,
  briefcase: Briefcase,
  "shopping-bag": ShoppingBag,
  "scroll-text": ScrollText,
  folder: FolderOpen,
  "hand-heart": HandHeart,
}

export interface NavItem {
  title: string
  url: string
  icon: keyof typeof iconMap
}

export interface DocumentItem {
  name: string
  url: string
  icon: keyof typeof iconMap
}

export interface User {
  name: string
  email: string
  avatar: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[]
  user: User
}

export function AppSidebar({
  navItems,
  user,
  variant,
  ...props
}: AppSidebarProps) {
  const [role, setRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          setRole(parsed?.role_name || null)
        } catch (e) {
          console.error("Error parsing user data from localStorage", e)
        }
      }
    }
  }, [])

  const filteredNavItems = React.useMemo(() => {
    if (!role) return navItems

    const r = role.toLowerCase()

    // Check for SUPER_ADMIN
    if (r === Roles.SUPER_ADMIN.toLowerCase() || r.includes("super_admin")) {
      return navItems
    }

    // Check for ADMIN
    if (r === Roles.ADMIN.toLowerCase() || r === "admin" || r.includes("role_admin")) {
      return navItems.filter(item => item.title !== "Audit Trail")
    }

    // Check for CONTENT_ADMIN
    if (r === Roles.CONTENT_ADMIN.toLowerCase() || r === "Content Admin" || r.includes("content_admin")) {
      const allowed = ["Events", "Blogs"] // Only Events and Blogs
      return navItems.filter(item => allowed.includes(item.title))
    }

    return navItems
  }, [navItems, role])

  const resolveIcons = <T extends { icon: keyof typeof iconMap }>(items: T[]) =>
    items.map((item) => ({
      ...item,
      icon: iconMap[item.icon] ?? FolderMinus,
    }))
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0"
            >
              <a
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-3 rounded-lg
               transition-colors hover:bg-muted/40"
              >
                {/* Logo */}
                <img
                  src="/SFU-LOGO.png"
                  alt="SFU Party Logo"
                  className="h-11 w-11 object-contain"
                />

                {/* Text Block */}
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-base font-bold tracking-wide">
                    SFU Party
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={resolveIcons(filteredNavItems)} />
        {/* {documents.length == 0 ? null :
          <NavDocuments items={resolveIcons(documents)} />
        } */}
        {/* <NavSecondary
          items={resolveIcons(navSecondary)}
          className="mt-auto"
        /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
