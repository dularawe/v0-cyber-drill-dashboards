import { NextResponse } from "next/server"

const questions: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const question = questions.find((q) => q.id === params.id)
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }
    return NextResponse.json(question, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const questionIndex = questions.findIndex((q) => q.id === params.id)
    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const body = await request.json()
    questions[questionIndex] = { ...questions[questionIndex], ...body, updated_at: new Date().toISOString() }

    return NextResponse.json(questions[questionIndex], { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = questions.findIndex((q) => q.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    questions.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
