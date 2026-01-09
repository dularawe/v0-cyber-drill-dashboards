import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const leaders = db.getLeaders()
    return NextResponse.json(leaders, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password, assignedXconId, team } = body

    if (!email || !name || !password || !assignedXconId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const leader = db.createLeader({
      email,
      name,
      password,
      assignedXconId,
      team: team || "",
    })

    return NextResponse.json(leader, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
