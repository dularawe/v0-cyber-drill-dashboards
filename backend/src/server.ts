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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

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
  console.log(`Cyber Drill Backend running on port ${PORT}`)
})
