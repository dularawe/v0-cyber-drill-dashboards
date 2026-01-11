"use client"

import { useEffect, useState } from "react"
import { Bell, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
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
      await markNotificationAsRead(id)
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id)
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

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1">
        <DashboardHeader title="Notifications" description="View All" />

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            {(["all", "unread", "xcon", "admin"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-medium ${
                  filter === f ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {f === "all" ? "All" : f === "unread" ? "Unread" : f === "xcon" ? "X-CON Updates" : "Admin Alerts"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-lg border-l-4 flex items-start justify-between ${
                    n.type === "success"
                      ? "border-green-500 bg-green-50"
                      : n.type === "error"
                        ? "border-red-500 bg-red-50"
                        : n.type === "warning"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-blue-500 bg-blue-50"
                  } ${!n.is_read ? "font-semibold" : ""}`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!n.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(n.id)}
                        className="whitespace-nowrap"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(n.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
