import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId || 1

    const leaderboard: any = await query(
      `SELECT l.*, u.name, u.email FROM leaderboard l 
       JOIN users u ON l.leader_id = u.id 
       WHERE l.session_id = ? 
       ORDER BY l.rank ASC`,
      [sessionId],
    )

    res.json(leaderboard || [])
  } catch (error) {
    console.log("[v0] Leaderboard error:", error)
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

export default router
