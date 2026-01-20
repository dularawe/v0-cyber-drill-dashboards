import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const sessions = await query("SELECT * FROM sessions ORDER BY created_at DESC")
    res.json(sessions)
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    res.status(500).json({ error: "Failed to fetch sessions" })
  }
})

// Get active session
router.get("/active", authMiddleware, async (req: Request, res: Response) => {
  try {
    const session: any = await query("SELECT * FROM sessions WHERE status = 'live' LIMIT 1")
    if (session.length === 0) {
      return res.status(404).json({ error: "No active session" })
    }
    res.json(session[0])
  } catch (error) {
    console.error("[v0] Error fetching active session:", error)
    res.status(500).json({ error: "Failed to fetch active session" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, questions, start_time, end_time } = req.body
    const result: any = await query(
      "INSERT INTO sessions (name, created_by, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)",
      [name, req.user.id, start_time, end_time, "draft"],
    )

    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        await query("INSERT INTO session_questions (session_id, question_id, order_num) VALUES (?, ?, ?)", [
          result.insertId,
          questions[i],
          i + 1,
        ])
      }
    }

    res.status(201).json({ id: result.insertId, name, status: "draft", start_time, end_time })
  } catch (error) {
    console.error("[v0] Error creating session:", error)
    res.status(500).json({ error: "Failed to create session" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { status, start_time, end_time } = req.body

    if (status && !["draft", "scheduled", "live", "running", "paused", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" })
    }

    const updates = []
    const values = []

    if (status) {
      updates.push("status = ?")
      values.push(status)
    }
    if (start_time !== undefined) {
      updates.push("start_time = ?")
      values.push(start_time)
    }
    if (end_time !== undefined) {
      updates.push("end_time = ?")
      values.push(end_time)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }

    values.push(req.params.id)
    const sqlQuery = `UPDATE sessions SET ${updates.join(", ")} WHERE id = ?`

    await query(sqlQuery, values)

    res.json({ id: req.params.id, status, start_time, end_time })
  } catch (error) {
    console.error("[v0] Error updating session:", error)
    res.status(500).json({ error: "Failed to update session" })
  }
})

router.delete("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM sessions WHERE id = ?", [req.params.id])
    res.json({ message: "Session deleted" })
  } catch (error) {
    console.error("[v0] Error deleting session:", error)
    res.status(500).json({ error: "Failed to delete session" })
  }
})

// Get questions for a specific session
router.get("/:id/questions", authMiddleware, async (req: Request, res: Response) => {
  try {
    const questions: any[] = (await query(
      `SELECT q.id, q.text, q.category, q.difficulty, q.time_limit, q.hint, sq.order_num
       FROM questions q
       INNER JOIN session_questions sq ON q.id = sq.question_id
       WHERE sq.session_id = ?
       ORDER BY sq.order_num ASC`,
      [req.params.id]
    )) as any[]

    // Get images for each question
    const questionsWithImages = await Promise.all(
      questions.map(async (q: any) => {
        const images: any[] = (await query(
          "SELECT id, image_data, image_type, display_order FROM question_images WHERE question_id = ? ORDER BY display_order",
          [q.id],
        )) as any[]
        return { ...q, images }
      }),
    )

    res.json(questionsWithImages)
  } catch (error) {
    console.error("[v0] Error fetching session questions:", error)
    res.status(500).json({ error: "Failed to fetch session questions" })
  }
})

export default router
