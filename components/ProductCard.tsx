"use client"

import { Product } from "@/types/product"
import { useState } from "react"

type Props = {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleProductClick = async () => {
    try {
      setIsLoading(true)

      // POST API 호출
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          thumbnail_url: product.thumbnail_url,
          price: product.price.toString(),
          info_url: product.info_url,
        }),
      })

      if (!res.ok) {
        throw new Error("API 호출 실패")
      }

      const data = await res.json()

      // 리뷰 요약 데이터를 sessionStorage에 저장 (새로고침 대비)
      const productDetail = {
        name: product.name,
        thumbnail_url: product.thumbnail_url,
        price: product.price,
        analysis: data.analysis || data,
      }
      sessionStorage.setItem(`product_${index}`, JSON.stringify(productDetail))

      // 깔끔한 URL로 이동
      window.location.href = `/product/${index}`
    } catch (error) {
      console.error("API 호출 실패:", error)
      setIsLoading(false)
      alert("상품 정보를 불러오는데 실패했습니다.")
    }
  }

  return (
    <>
      <div
        onClick={handleProductClick}
        className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-white/10 cursor-pointer"
      >
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="h-20 w-20 rounded-lg object-cover bg-slate-800"
        />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="text-lg font-semibold text-white group-hover:text-sky-300 transition">
            {product.name}
          </div>
          <div className="text-sky-300 font-semibold text-base">
            {product.price.toLocaleString()} 원
          </div>
          <a
            href={product.info_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky-300 transition"
            onClick={(e) => e.stopPropagation()}
          >
            상품 정보 보기 →
          </a>
        </div>
      </div>

      {/* 로딩 모달 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-col items-center gap-6">
              {/* 스피너 */}
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
              </div>

              {/* 메시지 */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  리뷰 분석 중...
                </h3>
                <p className="text-sm text-slate-400">
                  상품 리뷰를 크롤링하고 분석하는 중입니다.
                  <br />
                  잠시만 기다려주세요 (약 20초 소요)
                </p>
              </div>

              {/* 프로그레스 바 */}
              <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
