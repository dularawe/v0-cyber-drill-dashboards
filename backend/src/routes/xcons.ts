import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"
import bcrypt from "bcryptjs"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const xcons = await query("SELECT id, email, name FROM users WHERE role = ?", ["xcon"])
    res.json(xcons)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch X-CONs" })
  }
})

router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    console.log("[v0] Creating X-CON with:", { email, name })

    const hashedPassword = await bcrypt.hash(password, 10)
    const result: any = await query("INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)", [
      email,
      name,
      hashedPassword,
      "xcon",
    ])

    console.log("[v0] X-CON created successfully with ID:", result.insertId)
    res.json({ id: result.insertId, email, name })
  } catch (error) {
    console.log("[v0] Create X-CON error:", error instanceof Error ? error.message : error)
    res
      .status(500)
      .json({ error: "Failed to create X-CON", details: error instanceof Error ? error.message : "Unknown error" })
  }
})

router.patch("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body
    await query("UPDATE users SET email = ?, name = ? WHERE id = ?", [email, name, req.params.id])
    res.json({ id: req.params.id, email, name })
  } catch (error) {
    res.status(500).json({ error: "Failed to update X-CON" })
  }
})

router.delete("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM users WHERE id = ?", [req.params.id])
    res.json({ message: "X-CON deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete X-CON" })
  }
})

export default router
