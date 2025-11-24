import ProductCard from "./ProductCard"
import { Product } from "@/types/product"

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  if (!products.length) {
    return <p style={{ color: "#6b7280" }}>검색 결과가 없습니다.</p>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {products.map((product, index) => (
        <ProductCard key={`${product.info_url}-${index}`} product={product} index={index} />
      ))}
    </div>
  )
}
