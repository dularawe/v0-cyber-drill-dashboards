import { Router, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import { query } from "../config/database"
import { generateToken } from "../config/jwt"

const router = Router()

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const results: any = await query("SELECT * FROM users WHERE email = ?", [email])
    const user = results[0]

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(user.id, user.email, user.role)

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Sign in failed" })
  }
})

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body

    const existing: any = await query("SELECT id FROM users WHERE email = ?", [email])
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result: any = await query("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)", [
      email,
      hashedPassword,
      name,
      role,
    ])

    const token = generateToken(result.insertId, email, role)

    res.json({
      token,
      user: {
        id: result.insertId,
        email,
        name,
        role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Sign up failed" })
  }
})

router.post("/signout", async (req: Request, res: Response) => {
  res.json({ message: "Signed out successfully" })
})

export default router
