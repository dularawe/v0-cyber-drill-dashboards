import { NextResponse } from "next/server"

const xcons: any[] = []

export async function GET() {
  try {
    return NextResponse.json(xcons, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password, team } = body

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const xcon = {
      id: `xcon_${Date.now()}`,
      email,
      name,
      password,
      team: team || "",
      assignedLeaders: 0,
      reviewsCompleted: 0,
      created_at: new Date().toISOString(),
    }

    xcons.push(xcon)
    return NextResponse.json(xcon, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
