import { NextResponse } from "next/server"

const answers: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const answer = answers.find((a) => a.id === params.id)
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
    const answerIndex = answers.findIndex((a) => a.id === params.id)
    if (answerIndex === -1) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    const body = await request.json()
    answers[answerIndex] = { ...answers[answerIndex], ...body, updated_at: new Date().toISOString() }

    return NextResponse.json(answers[answerIndex], { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = answers.findIndex((a) => a.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    answers.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
