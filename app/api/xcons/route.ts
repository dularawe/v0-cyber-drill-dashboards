import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const xcons = db.getXCons()
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

    const xcon = db.createXCon({
      email,
      name,
      password,
      team: team || "",
    })

    return NextResponse.json(xcon, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
