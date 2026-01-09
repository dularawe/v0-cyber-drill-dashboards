import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

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
    const result: any = await query("INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)", [
      email,
      name,
      password,
      "xcon",
    ])
    res.json({ id: result.insertId, email, name })
  } catch (error) {
    res.status(500).json({ error: "Failed to create X-CON" })
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
