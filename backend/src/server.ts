import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import questionRoutes from "./routes/questions"
import leaderRoutes from "./routes/leaders"
import xconRoutes from "./routes/xcons"
import sessionRoutes from "./routes/sessions"
import answerRoutes from "./routes/answers"
import leaderboardRoutes from "./routes/leaderboard"
import pool from "./config/database"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

pool
  .getConnection()
  .then((conn) => {
    console.log("✓ Database connected successfully")
    conn.release()
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message)
    console.error("  Make sure MySQL is running and credentials in .env are correct")
  })

// Middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)

  // Log request body for POST/PATCH requests
  if (req.method === "POST" || req.method === "PATCH") {
    console.log(`  Body:`, JSON.stringify(req.body, null, 2))
  }

  // Log response status when response finishes
  res.on("finish", () => {
    console.log(`  Status: ${res.statusCode}`)
  })

  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api/leaders", leaderRoutes)
app.use("/api/xcons", xconRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/answers", answerRoutes)
app.use("/api/leaderboard", leaderboardRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" })
})

app.listen(PORT, () => {
  console.log(`✓ Cyber Drill Backend running on http://localhost:${PORT}`)
})
