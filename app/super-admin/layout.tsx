"use client"

import type React from "react"
import { Settings, Plus, CheckCircle2, Users, Clock, AlertCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    {
      label: "Overview",
      href: "/super-admin",
      icon: <Settings className="h-5 w-5" />,
      active: true,
    },
    {
      label: "Drill Management",
      href: "/super-admin/drills",
      icon: <Plus className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Questions",
      href: "/super-admin/questions",
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: false,
    },
    {
      label: "X-CONs",
      href: "/super-admin/xcons",
      icon: <Users className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Participants",
      href: "/super-admin/participants",
      icon: <Users className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Reports",
      href: "/super-admin/reports",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Notifications",
      href: "/super-admin/notifications",
      icon: <AlertCircle className="h-5 w-5" />,
      active: false,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
