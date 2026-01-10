"use client"

import type React from "react"

import { CheckCircle, User, Clock, Bell } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function XConLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    {
      label: "Review Queue",
      href: "/xcon",
      icon: <CheckCircle className="h-5 w-5" />,
      active: true,
    },
    {
      label: "My Leaders",
      href: "/xcon/leaders",
      icon: <User className="h-5 w-5" />,
      active: false,
    },
    {
      label: "History",
      href: "/xcon/history",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Notifications",
      href: "/xcon/notifications",
      icon: <Bell className="h-5 w-5" />,
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
