"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, CheckCircle2, Clock, Bell } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { getDrillSessions } from "@/lib/api-client"

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkDrillStatus()
    const interval = setInterval(checkDrillStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const checkDrillStatus = async () => {
    try {
      const sessions = await getDrillSessions()
      const activeDrill = sessions.find((s: any) => s.status === "live")

      if (activeDrill) {
        setIsAllowed(true)
      } else if (isAllowed) {
        // Only redirect if we previously allowed access, meaning drill status changed
        setIsAllowed(false)
        router.push("/landing")
      }
    } catch (error) {
      console.error("[v0] Error checking drill status:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Checking drill status...</p>
      </div>
    )
  }

  if (!isAllowed) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
