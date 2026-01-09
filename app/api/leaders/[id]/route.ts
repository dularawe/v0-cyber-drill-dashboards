import { NextResponse } from "next/server"

const leaders: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const leader = leaders.find((l) => l.id === params.id)
    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }
    return NextResponse.json(leader, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const leaderIndex = leaders.findIndex((l) => l.id === params.id)
    if (leaderIndex === -1) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    const body = await request.json()
    leaders[leaderIndex] = { ...leaders[leaderIndex], ...body, updated_at: new Date().toISOString() }

    return NextResponse.json(leaders[leaderIndex], { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = leaders.findIndex((l) => l.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 })
    }

    leaders.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
