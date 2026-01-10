"use client"

import { useState, useEffect } from "react"
import { Send, AlertCircle, CheckCircle2, Bell, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sendNotification, getNotifications, deleteNotification } from "@/lib/api-client"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  is_broadcast: boolean
  created_at: string
  read: boolean
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSending, setIsSending] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"info" | "success" | "warning" | "error">("info")
  const [recipientType, setRecipientType] = useState<"broadcast" | "leaders" | "xcons">("broadcast")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(data || [])
    } catch (error) {
      console.error("[v0] Error fetching notifications:", error)
      setAlert({ type: "error", message: "Failed to load notifications" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setAlert({ type: "error", message: "Please fill in title and message" })
      return
    }

    setIsSending(true)
    try {
      await sendNotification({
        title,
        message,
        type: notificationType,
        is_broadcast: recipientType === "broadcast",
        recipient_type: recipientType !== "broadcast" ? recipientType : null,
      })

      setAlert({ type: "success", message: "Notification sent successfully!" })
      setTitle("")
      setMessage("")
      setNotificationType("info")
      setRecipientType("broadcast")

      // Refresh notifications
      setTimeout(() => fetchNotifications(), 500)
    } catch (error) {
      console.error("[v0] Error sending notification:", error)
      setAlert({ type: "error", message: "Failed to send notification" })
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id)
      setNotifications(notifications.filter((n) => n.id !== id))
      setAlert({ type: "success", message: "Notification deleted" })
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
      setAlert({ type: "error", message: "Failed to delete notification" })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-l-4 border-green-500 text-green-700"
      case "warning":
        return "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
      case "error":
        return "bg-red-100 border-l-4 border-red-500 text-red-700"
      default:
        return "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const sidebarItems = [
    {
      label: "Overview",
      href: "/super-admin",
      icon: <AlertCircle className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Create Drill",
      href: "/super-admin/create-drill",
      icon: <AlertCircle className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Questions",
      href: "/super-admin/questions",
      icon: <AlertCircle className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Notifications",
      href: "/super-admin/notifications",
      icon: <Bell className="h-5 w-5" />,
      active: true,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Notifications & Messaging" status="Active" userRole="Super Admin" />

        {alert && (
          <div
            className={`mx-4 mt-4 p-4 rounded-lg flex items-center gap-2 ${
              alert.type === "success"
                ? "bg-green-100 border-l-4 border-green-500 text-green-700"
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Send Notification Form */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Send Group Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notification Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Drill Reminder"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message Content</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Notification Type</label>
                    <select
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value as "info" | "success" | "warning" | "error")}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Send To</label>
                    <select
                      value={recipientType}
                      onChange={(e) => setRecipientType(e.target.value as "broadcast" | "leaders" | "xcons")}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="broadcast">All Users</option>
                      <option value="leaders">Leaders Only</option>
                      <option value="xcons">X-CONs Only</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleSendNotification}
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </CardContent>
            </Card>

            {/* Notifications History */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Message History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-lg flex items-start justify-between ${getTypeColor(notif.type)}`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getTypeIcon(notif.type)}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notif.title}</h3>
                            <p className="text-sm mt-1">{notif.message}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="px-2 py-1 rounded bg-black/10">
                                {notif.is_broadcast ? "Broadcast" : "Targeted"}
                              </span>
                              <span className="px-2 py-1 rounded bg-black/10">
                                {new Date(notif.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteNotification(notif.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
