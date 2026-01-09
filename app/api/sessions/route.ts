import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const sessions = db.getSessions()
    return NextResponse.json(sessions, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Session name required" }, { status: 400 })
    }

    const session = db.createSession({
      name,
      status: "draft",
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
