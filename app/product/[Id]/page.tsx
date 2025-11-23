type Props = {
  params: { Id: string }
  searchParams?: { name?: string }
}

export default function ProductDetailPage({ params, searchParams }: Props) {
  const { Id } = params
  const productName = searchParams?.name || "상품 이름 없음"

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>상품 상세 페이지</h1>
      <p style={{ marginTop: 12, color: "#111827", fontWeight: 600 }}>{productName}</p>
    </div>
  )
}
