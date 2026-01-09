import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const questions = db.getQuestions()
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, category, difficulty, timeLimit } = body

    if (!text || !category || !difficulty || !timeLimit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const question = db.createQuestion({
      text,
      category,
      difficulty,
      timeLimit,
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
