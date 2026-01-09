import { NextResponse } from "next/server"

const answers: any[] = []

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const answerIndex = answers.findIndex((a) => a.id === params.id)
    if (answerIndex === -1) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    const body = await request.json()
    answers[answerIndex] = {
      ...answers[answerIndex],
      status: "approved",
      feedback: body.feedback || null,
      reviewed_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, answer: answers[answerIndex] }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
