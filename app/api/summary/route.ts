import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, thumbnail_url, price, info_url } = body

    if (!name || !thumbnail_url || !price || !info_url) {
      return NextResponse.json(
        { status: 400 }
      )
    }

    const res = await fetch(`${BACKEND_BASE_URL}/review/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        thumbnail_url,
        price,
        info_url,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      return NextResponse.json(
        { error: `backend error: ${detail || res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("/api/summary proxy error", error)
    return NextResponse.json(
      { error: "failed to fetch summary from backend" },
      { status: 500 }
    )
  }
}
