import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const questions = await query("SELECT * FROM questions ORDER BY created_at DESC")
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { text, category, difficulty, timeLimit } = req.body
    const result: any = await query(
      "INSERT INTO questions (text, category, difficulty, time_limit) VALUES (?, ?, ?, ?)",
      [text, category, difficulty, timeLimit],
    )

    res.json({ id: result.insertId, text, category, difficulty, timeLimit })
  } catch (error) {
    console.log("[v0] Create question error:", error)
    res.status(500).json({ error: "Failed to create question" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const questions: any = await query("SELECT * FROM questions WHERE id = ?", [req.params.id])
    if (questions.length === 0) {
      return res.status(404).json({ error: "Question not found" })
    }
    res.json(questions[0])
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch question" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { text, category, difficulty, time_limit } = req.body
    await query("UPDATE questions SET text = ?, category = ?, difficulty = ?, time_limit = ? WHERE id = ?", [
      text,
      category,
      difficulty,
      time_limit,
      req.params.id,
    ])
    res.json({ id: req.params.id, text, category, difficulty, time_limit })
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" })
  }
})

router.delete("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM questions WHERE id = ?", [req.params.id])
    res.json({ message: "Question deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" })
  }
})

export default router
