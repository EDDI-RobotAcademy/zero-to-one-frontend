import ProductCard from "./ProductCard"
import { Product } from "@/types/product"

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  if (!products.length) {
    return <p className="text-sm text-slate-400">검색 결과가 없습니다.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product, index) => (
        <ProductCard key={`${product.info_url}-${index}`} product={product} index={index} />
      ))}
    </div>
  )
}
