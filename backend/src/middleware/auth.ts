import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../config/jwt"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" })
  }

  req.user = decoded
  next()
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

export function xconOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "xcon") {
    return res.status(403).json({ error: "X-CON access required" })
  }
  next()
}
