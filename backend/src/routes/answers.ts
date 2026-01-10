import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, xconOnly } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    let sql = "SELECT * FROM answers WHERE status = ?"
    let params: any[] = ["submitted"]

    if (req.user.role === "xcon") {
      sql = `SELECT a.* FROM answers a 
             JOIN users l ON a.leader_id = l.id 
             WHERE l.xcon_id = ? AND a.status = ?`
      params = [req.user.id, "submitted"]
    }

    const answers = await query(sql, params)
    res.json(answers)
  } catch (error) {
    console.error("[v0] Error fetching answers:", error)
    res.status(500).json({ error: "Failed to fetch answers" })
  }
})

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { session_id, question_id, answer_text } = req.body

    if (!session_id || !question_id || !answer_text) {
      return res.status(400).json({ error: "Missing required fields: session_id, question_id, answer_text" })
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    const result: any = await query(
      "INSERT INTO answers (session_id, question_id, leader_id, answer_text, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [session_id, question_id, req.user.id, answer_text, "submitted"],
    )

    if (!result || !result.insertId) {
      return res.status(500).json({ error: "Failed to insert answer record" })
    }

    console.log("[v0] Answer submitted successfully:", result.insertId)
    res.status(201).json({
      id: result.insertId,
      session_id,
      question_id,
      status: "submitted",
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error submitting answer:", error)
    res.status(500).json({ error: "Failed to submit answer", details: String(error) })
  }
})

router.post("/:id/timeout", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question_id, session_id } = req.body

    // Mark as rejected due to timeout
    const result: any = await query(
      "INSERT INTO answers (session_id, question_id, leader_id, answer_text, status, feedback) VALUES (?, ?, ?, ?, ?, ?)",
      [session_id, question_id, req.user.id, "[No answer - Time limit exceeded]", "rejected", "Time limit exceeded"],
    )

    res.json({ id: result.insertId, status: "rejected", reason: "timeout" })
  } catch (error) {
    console.error("[v0] Error marking timeout:", error)
    res.status(500).json({ error: "Failed to mark timeout" })
  }
})

router.post("/:id/approve", authMiddleware, xconOnly, async (req: Request, res: Response) => {
  try {
    const { feedback } = req.body
    await query("UPDATE answers SET status = ?, feedback = ?, reviewed_by = ? WHERE id = ?", [
      "approved",
      feedback,
      req.user.id,
      req.params.id,
    ])
    res.json({ id: req.params.id, status: "approved" })
  } catch (error) {
    console.error("[v0] Error approving answer:", error)
    res.status(500).json({ error: "Failed to approve answer" })
  }
})

router.post("/:id/reject", authMiddleware, xconOnly, async (req: Request, res: Response) => {
  try {
    const { feedback } = req.body
    await query("UPDATE answers SET status = ?, feedback = ?, reviewed_by = ? WHERE id = ?", [
      "rejected",
      feedback,
      req.user.id,
      req.params.id,
    ])
    res.json({ id: req.params.id, status: "rejected" })
  } catch (error) {
    console.error("[v0] Error rejecting answer:", error)
    res.status(500).json({ error: "Failed to reject answer" })
  }
})

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM answers WHERE id = ?", [req.params.id])
    res.json({ message: "Answer deleted" })
  } catch (error) {
    console.error("[v0] Error deleting answer:", error)
    res.status(500).json({ error: "Failed to delete answer" })
  }
})

export default router
