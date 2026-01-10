"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle2, AlertCircle, Trash2, Mail } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { getNotifications, markNotificationAsRead, deleteNotification } from "@/lib/api-client"

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_read: boolean
  recipient_role: string
  created_at: string
}

export default function LeaderNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "xcon" | "admin">("all")

  const sidebarItems = [
    { label: "Dashboard", href: "/leader", icon: <Bell className="h-5 w-5" />, active: false },
    { label: "My Answers", href: "/leader/answers", icon: <Mail className="h-5 w-5" />, active: false },
    { label: "Notifications", href: "/leader/notifications", icon: <Bell className="h-5 w-5" />, active: true },
  ]

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("[v0] Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id.toString())
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id.toString())
      setNotifications(notifications.filter((n) => n.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read
    if (filter === "xcon") return n.recipient_role === "xcon"
    if (filter === "admin") return n.recipient_role === "admin"
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-green-500"
      case "error":
        return "bg-red-50 border-l-4 border-red-500"
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500"
      default:
        return "bg-blue-50 border-l-4 border-blue-500"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Notifications" status="View All" userRole="Leader" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              {(["all", "unread", "xcon", "admin"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {f === "all" ? "All" : f === "unread" ? "Unread" : f === "xcon" ? "X-CON Updates" : "Admin Alerts"}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No notifications {filter !== "all" ? `for ${filter}` : ""}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg flex items-start gap-4 ${getNotificationBg(notification.type)} ${
                      !notification.is_read ? "shadow-md" : ""
                    }`}
                  >
                    <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
