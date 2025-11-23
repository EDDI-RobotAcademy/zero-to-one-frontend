import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get("keyword")?.trim()

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 })
  }

  // const dummyResults = [
  //   { productId: "1", title: `${keyword} 상품 1`, price: 10000 },
  //   { productId: "2", title: `${keyword} 상품 2`, price: 20000 },
  //   { productId: "3", title: `${keyword} 상품 3`, price: 30000 },
  // ];
  // return NextResponse.json({ results: dummyResults });

  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/naver/products?query=${encodeURIComponent(keyword)}`,
      { next: { revalidate: 0 } }
    )

    if (!res.ok) {
      const detail = await res.text()
      return NextResponse.json(
        { error: `backend error: ${detail || res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json({ results: data.items ?? [] })
  } catch (error) {
    console.error("/api/search proxy error", error)
    return NextResponse.json({ error: "failed to fetch products" }, { status: 500 })
  }
}
