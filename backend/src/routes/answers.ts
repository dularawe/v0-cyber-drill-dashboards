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
    res.status(500).json({ error: "Failed to fetch answers" })
  }
})

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { session_id, question_id, answer_text } = req.body

    const result: any = await query(
      "INSERT INTO answers (session_id, question_id, leader_id, answer_text) VALUES (?, ?, ?, ?)",
      [session_id, question_id, req.user.id, answer_text],
    )

    res.json({ id: result.insertId, status: "submitted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to submit answer" })
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
    res.status(500).json({ error: "Failed to reject answer" })
  }
})

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM answers WHERE id = ?", [req.params.id])
    res.json({ message: "Answer deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete answer" })
  }
})

export default router
