import { NextResponse } from "next/server"

const xcons: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const xcon = xcons.find((x) => x.id === params.id)
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
    const xconIndex = xcons.findIndex((x) => x.id === params.id)
    if (xconIndex === -1) {
      return NextResponse.json({ error: "X-CON not found" }, { status: 404 })
    }

    const body = await request.json()
    xcons[xconIndex] = { ...xcons[xconIndex], ...body, updated_at: new Date().toISOString() }

    return NextResponse.json(xcons[xconIndex], { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const index = xcons.findIndex((x) => x.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "X-CON not found" }, { status: 404 })
    }

    xcons.splice(index, 1)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
