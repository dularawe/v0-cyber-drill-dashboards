import bcrypt from "bcryptjs"
import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

async function setupAdmin() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cyber_drill",
    })

    const connection = await pool.getConnection()

    // Hash the password "Admin@2024"
    const hashedPassword = await bcrypt.hash("Admin@2024", 10)
    console.log("[v0] Generated hash for Admin@2024:", hashedPassword)

    // Insert or update admin user
    await connection.execute(
      `INSERT INTO users (email, password, name, role, created_at) 
       VALUES (?, ?, ?, ?, NOW()) 
       ON DUPLICATE KEY UPDATE password = ?`,
      ["admin@cyberdrill.com", hashedPassword, "Admin User", "super_admin", hashedPassword],
    )

    console.log("[v0] Admin user created/updated successfully!")
    console.log("[v0] Email: admin@cyberdrill.com")
    console.log("[v0] Password: Admin@2024")

    connection.release()
    pool.end()
  } catch (error) {
    console.error("[v0] Setup failed:", error)
    process.exit(1)
  }
}

setupAdmin()
