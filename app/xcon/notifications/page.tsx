"use client"

import { useEffect, useState } from "react"
import { Bell, Send, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNotifications, sendNotification, deleteNotification, getLeaders } from "@/lib/api-client"

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_read: boolean
  created_at: string
}

interface Leader {
  id: number
  name: string
  email: string
}

export default function XConNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [selectedLeaders, setSelectedLeaders] = useState<number[]>([])
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "error" | "success">("info")
  const [broadcastToAll, setBroadcastToAll] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notificationsData, leadersData] = await Promise.all([getNotifications(), getLeaders()])
        setNotifications(notificationsData)
        setLeaders(leadersData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setAlert({ type: "error", message: "Title and message are required" })
      return
    }

    if (!broadcastToAll && selectedLeaders.length === 0) {
      setAlert({ type: "error", message: "Please select leaders or broadcast to all" })
      return
    }

    setSending(true)
    try {
      const notificationData = {
        title,
        message,
        type: notificationType,
        is_broadcast: broadcastToAll,
        recipient_role: broadcastToAll ? "leader" : undefined,
        recipient_id: !broadcastToAll ? selectedLeaders[0] : undefined,
      }

      await sendNotification(notificationData)
      setAlert({ type: "success", message: "Notification sent successfully!" })
      setTitle("")
      setMessage("")
      setSelectedLeaders([])
      setBroadcastToAll(false)

      // Refresh notifications
      const updated = await getNotifications()
      setNotifications(updated)
    } catch (error) {
      console.error("[v0] Error sending notification:", error)
      setAlert({ type: "error", message: "Failed to send notification" })
    } finally {
      setSending(false)
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
    <main className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader title="Notifications & Alerts" status="Send Updates" userRole="X-CON" />

      {alert && (
        <div
          className={`mx-4 mt-4 p-4 rounded-lg flex items-center gap-2 ${alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`}
        >
          {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Send Notification Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Send Notification to Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Notification Type</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastToAll}
                    onChange={(e) => setBroadcastToAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Broadcast to all leaders</span>
                </label>

                {!broadcastToAll && (
                  <div className="space-y-2 mt-3">
                    <label className="text-sm font-semibold text-foreground">Select Leaders</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {leaders.map((leader) => (
                        <label key={leader.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLeaders.includes(leader.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeaders([...selectedLeaders, leader.id])
                              } else {
                                setSelectedLeaders(selectedLeaders.filter((id) => id !== leader.id))
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-foreground">{leader.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSendNotification}
                disabled={sending}
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send Notification"}
              </Button>
            </CardContent>
          </Card>

          {/* Received Notifications */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Admin Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No notifications received</div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg flex items-start gap-4 ${getNotificationBg(notification.type)}`}
                    >
                      <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
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
  )
}
