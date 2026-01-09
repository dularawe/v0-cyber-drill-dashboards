import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const leaderId = searchParams.get("leaderId")
    const sessionId = searchParams.get("sessionId")
    const status = searchParams.get("status")

    const answers = db.getAnswers({
      leaderId: leaderId || undefined,
      sessionId: sessionId || undefined,
      status: status || undefined,
    })

    return NextResponse.json(answers, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { leaderId, sessionId, questionId, text, attemptNumber } = body

    if (!leaderId || !sessionId || !questionId || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const answer = db.createAnswer({
      leaderId,
      sessionId,
      questionId,
      text,
      status: "pending",
      attemptNumber: attemptNumber || 1,
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
