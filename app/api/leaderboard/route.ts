import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const leaderboardData = {
      sessionId,
      ranking: [
        { rank: 1, leaderId: "leader_1", name: "Leader 1", score: 950, correct: 19, total: 20 },
        { rank: 2, leaderId: "leader_2", name: "Leader 2", score: 900, correct: 18, total: 20 },
        { rank: 3, leaderId: "leader_3", name: "Leader 3", score: 850, correct: 17, total: 20 },
      ],
    }

    return NextResponse.json(leaderboardData, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
