import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "";

  const dummyResults = [
    { productId: "1", title: `${keyword} 상품 1`, price: 10000 },
    { productId: "2", title: `${keyword} 상품 2`, price: 20000 },
    { productId: "3", title: `${keyword} 상품 3`, price: 30000 },
  ];

  return NextResponse.json({ results: dummyResults });
}