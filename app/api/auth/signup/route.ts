import { NextResponse } from "next/server"

const users = new Map()

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 })
    }

    if (users.has(email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const id = `user_${Date.now()}`
    users.set(email, { id, email, password, name, role })

    return NextResponse.json(
      {
        success: true,
        user: { id, email, name, role },
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
