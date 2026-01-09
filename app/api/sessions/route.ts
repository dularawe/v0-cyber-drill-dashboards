import { NextResponse } from "next/server"

const sessions: any[] = []

export async function GET() {
  try {
    return NextResponse.json(sessions, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: "Session name required" }, { status: 400 })
    }

    const session = {
      id: `session_${Date.now()}`,
      name,
      description: description || "",
      status: "pending",
      startedAt: null,
      endedAt: null,
      created_at: new Date().toISOString(),
    }

    sessions.push(session)
    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
