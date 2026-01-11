"use client"

import { useState, useEffect } from "react"
import { Send, AlertCircle, CheckCircle2, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
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
      setNotifications(data)
    } catch (error) {
      console.error("[v0] Error fetching notifications:", error)
      setAlert({ type: "error", message: "Failed to load notifications" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setAlert({ type: "error", message: "Please fill in all fields" })
      return
    }

    setIsSending(true)
    try {
      const payload = {
        title,
        message,
        type: notificationType,
        recipient_type: recipientType,
      }

      await sendNotification(payload)
      setAlert({ type: "success", message: "Notification sent successfully!" })
      setTitle("")
      setMessage("")
      fetchNotifications()
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

  return (
    <main className="flex-1">
      <DashboardHeader title="Notifications & Messaging" description="Active" />

      <div className="p-6 space-y-6">
        {alert && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              alert.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {alert.message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Send Group Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Notification Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Drill Reminder"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message Content</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Notification Type</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as "info" | "success" | "warning" | "error")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Send To</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value as "broadcast" | "leaders" | "xcons")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="broadcast">All Users</option>
                  <option value="leaders">Leaders Only</option>
                  <option value="xcons">X-CONs Only</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleSendNotification}
              disabled={isSending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No messages sent yet</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="ml-4"
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
    </main>
  )
}
