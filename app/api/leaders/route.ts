import { NextResponse } from "next/server"

const leaders: any[] = []

export async function GET() {
  try {
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

    const leader = {
      id: `leader_${Date.now()}`,
      email,
      name,
      password,
      assignedXconId,
      team: team || "",
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      created_at: new Date().toISOString(),
    }

    leaders.push(leader)
    return NextResponse.json(leader, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
