import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderData {
  title: string
  children?: React.ReactNode
}

export function SiteHeader({ title, children }: SiteHeaderData) {
  return (
    <header className="sap-titlebar flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-white/10" />
        <Separator
          orientation="vertical"
          className="mx-2 bg-white/25 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm font-semibold uppercase tracking-wide">{title}</h1>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  )
}
