import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const sessions = await query("SELECT * FROM sessions ORDER BY created_at DESC")
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, questions } = req.body
    const result: any = await query("INSERT INTO sessions (name, created_by) VALUES (?, ?)", [name, req.user.id])

    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        await query("INSERT INTO session_questions (session_id, question_id, order_num) VALUES (?, ?, ?)", [
          result.insertId,
          questions[i],
          i + 1,
        ])
      }
    }

    res.json({ id: result.insertId, name, status: "draft" })
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { status, start_time, end_time } = req.body
    await query("UPDATE sessions SET status = ?, start_time = ?, end_time = ? WHERE id = ?", [
      status,
      start_time,
      end_time,
      req.params.id,
    ])
    res.json({ id: req.params.id, status })
  } catch (error) {
    res.status(500).json({ error: "Failed to update session" })
  }
})

router.delete("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM sessions WHERE id = ?", [req.params.id])
    res.json({ message: "Session deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" })
  }
})

export default router
