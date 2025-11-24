import Link from "next/link"
import { Product } from "@/types/product"

type Props = {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: Props) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <img
        src={product.thumbnail_url}
        alt={product.name}
        style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, background: "#f3f4f6" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: "#111827" }}>
          <Link
            href={`/product/${index}?name=${encodeURIComponent(product.name)}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </div>
        <div style={{ color: "#2563eb", fontWeight: 600 }}>{product.price.toLocaleString()} 원</div>
        <a
          href={product.info_url}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#6b7280", fontSize: 14, marginTop: 6, display: "inline-block" }}
        >
          상품 정보 보기 →
        </a>
      </div>
    </div>
  )
}
