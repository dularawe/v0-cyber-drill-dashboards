import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const answer = db.getAnswerById(params.id)
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }
    return NextResponse.json(answer, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const answer = db.updateAnswer(params.id, body)

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    return NextResponse.json(answer, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = db.deleteAnswer(params.id)
    if (!success) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
