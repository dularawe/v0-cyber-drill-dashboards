import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

// Get notifications for current user
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const notifications = await query(
      `SELECT * FROM notifications 
       WHERE (recipient_id = ? OR is_broadcast = TRUE) 
       ORDER BY created_at DESC LIMIT 50`,
      [req.user.id],
    )
    res.json(notifications)
  } catch (error) {
    console.error("[v0] Error fetching notifications:", error)
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
})

// Get unread notifications count
router.get("/unread/count", authMiddleware, async (req: Request, res: Response) => {
  try {
    const result: any = await query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE (recipient_id = ? OR is_broadcast = TRUE) AND is_read = FALSE`,
      [req.user.id],
    )
    res.json({ unread_count: result[0]?.count || 0 })
  } catch (error) {
    console.error("[v0] Error fetching unread count:", error)
    res.status(500).json({ error: "Failed to fetch unread count" })
  }
})

// Send notification (admin only)
router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { title, message, type, recipient_id, is_broadcast, recipient_role } = req.body

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" })
    }

    const result: any = await query(
      `INSERT INTO notifications 
       (title, message, type, recipient_id, is_broadcast, recipient_role, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        message,
        type || "info",
        recipient_id || null,
        is_broadcast || false,
        recipient_role || null,
        req.user.id,
      ],
    )

    console.log("[v0] Notification sent:", result.insertId)
    res.status(201).json({ id: result.insertId, title, message, created_at: new Date() })
  } catch (error) {
    console.error("[v0] Error sending notification:", error)
    res.status(500).json({ error: "Failed to send notification" })
  }
})

// Mark notification as read
router.post("/:id/read", authMiddleware, async (req: Request, res: Response) => {
  try {
    await query("UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND recipient_id = ?", [
      req.params.id,
      req.user.id,
    ])
    res.json({ id: req.params.id, is_read: true })
  } catch (error) {
    console.error("[v0] Error marking notification as read:", error)
    res.status(500).json({ error: "Failed to mark notification as read" })
  }
})

// Delete notification
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM notifications WHERE id = ? AND (recipient_id = ? OR is_broadcast = FALSE)", [
      req.params.id,
      req.user.id,
    ])
    res.json({ message: "Notification deleted" })
  } catch (error) {
    console.error("[v0] Error deleting notification:", error)
    res.status(500).json({ error: "Failed to delete notification" })
  }
})

export default router
