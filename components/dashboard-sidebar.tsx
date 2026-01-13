import type React from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  active?: boolean
}

interface DashboardSidebarProps {
  items: SidebarItem[]
}

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-sidebar min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
        <img
          src="https://www.cert.gov.lk/wp-content/uploads/2024/11/logo-b-1.png"
          alt="Government Logo"
          className="h-10 w-16 object-contain"
        />
        <h1 className="text-lg font-semibold text-sidebar-foreground">Cyber Drill</h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <span className="h-5 w-5">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-6 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition">
          <HelpCircle className="h-5 w-5" />
          Help
        </button>
      </div>
    </aside>
  )
}
