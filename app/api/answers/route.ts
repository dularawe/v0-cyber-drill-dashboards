import { NextResponse } from "next/server"

const answers: any[] = []

export async function GET() {
  try {
    return NextResponse.json(answers, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { leaderId, sessionId, questionId, answer, attempt } = body

    if (!leaderId || !sessionId || !questionId || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newAnswer = {
      id: `answer_${Date.now()}`,
      leaderId,
      sessionId,
      questionId,
      answer,
      attempt: attempt || 1,
      status: "pending",
      feedback: null,
      reviewed_by: null,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
    }

    answers.push(newAnswer)
    return NextResponse.json(newAnswer, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
