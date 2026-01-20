"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, User, Clock, Bell } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { getDrillSessions } from "@/lib/api-client"

export default function XConLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const isAllowedRef = useRef(false)
  const hasCheckedOnce = useRef(false)

  const checkDrillStatus = useCallback(async () => {
    try {
      const sessions = await getDrillSessions()
      const activeDrill = sessions.find((s: any) => s.status === "running")

      if (activeDrill) {
        if (!isAllowedRef.current) {
          isAllowedRef.current = true
          setIsAllowed(true)
        }
      } else if (isAllowedRef.current && hasCheckedOnce.current) {
        // Only redirect if we previously had access and drill ended
        isAllowedRef.current = false
        setIsAllowed(false)
        router.push("/landing")
      }
      hasCheckedOnce.current = true
    } catch (error) {
      console.error("[v0] Error checking drill status:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkDrillStatus()
    const interval = setInterval(checkDrillStatus, 5000) // Reduced frequency to 5 seconds
    return () => clearInterval(interval)
  }, [checkDrillStatus])

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
