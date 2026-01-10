import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"
import bcrypt from "bcryptjs"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const leaders = await query("SELECT id, email, name, xcon_id FROM users WHERE role = ?", ["leader"])
    res.json(leaders)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaders" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { email, name, password, xcon_id } = req.body

    console.log("[v0] Creating leader with:", { email, name, xcon_id })

    const hashedPassword = await bcrypt.hash(password, 10)
    const result: any = await query("INSERT INTO users (email, name, password, role, xcon_id) VALUES (?, ?, ?, ?, ?)", [
      email,
      name,
      hashedPassword,
      "leader",
      xcon_id,
    ])

    console.log("[v0] Leader created successfully with ID:", result.insertId)
    res.json({ id: result.insertId, email, name, xcon_id })
  } catch (error) {
    console.log("[v0] Create leader error:", error instanceof Error ? error.message : error)
    res
      .status(500)
      .json({ error: "Failed to create leader", details: error instanceof Error ? error.message : "Unknown error" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { email, name, xcon_id } = req.body
    await query("UPDATE users SET email = ?, name = ?, xcon_id = ? WHERE id = ?", [email, name, xcon_id, req.params.id])
    res.json({ id: req.params.id, email, name, xcon_id })
  } catch (error) {
    res.status(500).json({ error: "Failed to update leader" })
  }
})

router.delete("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM users WHERE id = ?", [req.params.id])
    res.json({ message: "Leader deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete leader" })
  }
})

export default router
