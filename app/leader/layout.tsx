"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, CheckCircle2, Clock, Bell } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const sidebarItems = [
    {
      label: "Drill Interface",
      href: "/leader",
      icon: <MessageCircle className="h-5 w-5" />,
      active: true,
    },
    {
      label: "Live Standings",
      href: "/leader/standings",
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Answer Review",
      href: "/leader/answers",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Notifications",
      href: "/leader/notifications",
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
