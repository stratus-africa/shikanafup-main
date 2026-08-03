import { type LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "@/lib/next-shims"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Item = {
  title: string
  url: string
  icon?: LucideIcon
  group?: string
}

export function NavMain({ items }: { items: Item[] }) {
  const router = useRouter()
  const pathname = usePathname()

  // Preserve declaration order of groups
  const groups: { label: string | null; items: Item[] }[] = []
  for (const item of items) {
    const label = item.group ?? null
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }

  return (
    <>
      {groups.map((group, i) => (
        <SidebarGroup key={group.label ?? `group-${i}`}>
          {group.label && (
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/")

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      onClick={() => router.push(item.url)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
