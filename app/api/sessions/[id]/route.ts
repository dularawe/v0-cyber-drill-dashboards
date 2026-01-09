import { NextResponse } from "next/server"

const sessions: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = sessions.find((s) => s.id === params.id)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    return NextResponse.json(session, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionIndex = sessions.findIndex((s) => s.id === params.id)
    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const body = await request.json()
    const updates: any = { ...body, updated_at: new Date().toISOString() }

    if (body.status === "active") {
      updates.startedAt = new Date().toISOString()
    }
    if (body.status === "completed") {
      updates.endedAt = new Date().toISOString()
    }

    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates }

    return NextResponse.json(sessions[sessionIndex], { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = sessions.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    sessions.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
