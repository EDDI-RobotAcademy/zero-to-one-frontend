import Link from "next/link"
import { Product } from "@/types/product"

type Props = {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-white/10">
      <img
        src={product.thumbnail_url}
        alt={product.name}
        className="h-20 w-20 rounded-lg object-cover bg-slate-800"
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-lg font-semibold text-white">
          <Link
            href={`/product/${index}?name=${encodeURIComponent(product.name)}`}
            className="hover:text-sky-300 transition"
          >
            {product.name}
          </Link>
        </div>
        <div className="text-sky-300 font-semibold text-base">
          {product.price.toLocaleString()} 원
        </div>
        <a
          href={product.info_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky-300 transition"
        >
          상품 정보 보기 →
        </a>
      </div>
    </div>
  )
}
