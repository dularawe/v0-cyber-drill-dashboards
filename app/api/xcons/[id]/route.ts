import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const xcon = db.getXConById(params.id)
    if (!xcon) {
      return NextResponse.json({ error: "X-CON not found" }, { status: 404 })
    }
    return NextResponse.json(xcon, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const xcon = db.updateXCon(params.id, body)

    if (!xcon) {
      return NextResponse.json({ error: "X-CON not found" }, { status: 404 })
    }

    return NextResponse.json(xcon, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = db.deleteXCon(params.id)
    if (!success) {
      return NextResponse.json({ error: "X-CON not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
