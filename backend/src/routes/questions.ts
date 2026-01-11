import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const questions: any[] = await query("SELECT * FROM questions ORDER BY created_at DESC")

    const questionsWithImages = await Promise.all(
      questions.map(async (q: any) => {
        const images: any[] = await query(
          "SELECT id, image_data, image_type, display_order FROM question_images WHERE question_id = ? ORDER BY display_order",
          [q.id],
        )
        return { ...q, images }
      }),
    )

    res.json(questionsWithImages)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { text, category, difficulty, timeLimit, images } = req.body
    const result: any = await query(
      "INSERT INTO questions (text, category, difficulty, time_limit) VALUES (?, ?, ?, ?)",
      [text, category, difficulty, timeLimit],
    )

    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < Math.min(images.length, 5); i++) {
        const img = images[i]
        await query(
          "INSERT INTO question_images (question_id, image_data, image_type, display_order) VALUES (?, ?, ?, ?)",
          [result.insertId, img.data, img.type || "image/jpeg", i],
        )
      }
    }

    res.json({ id: result.insertId, text, category, difficulty, timeLimit, images: images || [] })
  } catch (error) {
    console.log("[v0] Create question error:", error)
    res.status(500).json({ error: "Failed to create question" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const questions: any[] = await query("SELECT * FROM questions WHERE id = ?", [req.params.id])
    if (questions.length === 0) {
      return res.status(404).json({ error: "Question not found" })
    }

    const images: any[] = await query(
      "SELECT id, image_data, image_type, display_order FROM question_images WHERE question_id = ? ORDER BY display_order",
      [req.params.id],
    )

    res.json({ ...questions[0], images })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch question" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { text, category, difficulty, time_limit, images } = req.body
    await query("UPDATE questions SET text = ?, category = ?, difficulty = ?, time_limit = ? WHERE id = ?", [
      text,
      category,
      difficulty,
      time_limit,
      req.params.id,
    ])

    if (images !== undefined) {
      await query("DELETE FROM question_images WHERE question_id = ?", [req.params.id])

      if (Array.isArray(images) && images.length > 0) {
        for (let i = 0; i < Math.min(images.length, 5); i++) {
          const img = images[i]
          if (img.data) {
            await query(
              "INSERT INTO question_images (question_id, image_data, image_type, display_order) VALUES (?, ?, ?, ?)",
              [req.params.id, img.data, img.type || "image/jpeg", i],
            )
          }
        }
      }
    }

    res.json({ id: req.params.id, text, category, difficulty, time_limit, images: images || [] })
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
