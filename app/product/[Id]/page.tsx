"use client";

import { useEffect, useState, use } from "react";

type Props = {
  params: Promise<{ Id: string }>;
};

type ProductSummary = {
  created_at: string;
  keywords: string[];
  name: string;
  negative_features: string;
  positive_features: string;
  price: string;
  summary: string;
  title: string;
};

type AnalysisData = {
  pdf_url: string;
  product_summary: ProductSummary;
};

type ProductDetail = {
  name: string;
  thumbnail_url: string;
  price: number;
  analysis: AnalysisData;
};

export default function ProductDetailPage({ params }: Props) {
  const { Id } = use(params); // Promise unwrap
  const [productData, setProductData] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProductDetail = () => {
      try {
        setIsLoading(true);

        // sessionStorage에서 리뷰 요약 데이터 가져오기
        const savedData = sessionStorage.getItem(`product_${Id}`);

        if (!savedData) {
          throw new Error("상품 정보를 찾을 수 없습니다. 상품 목록에서 다시 선택해주세요.");
        }

        const data: ProductDetail = JSON.parse(savedData);

        if (!data.analysis) {
          throw new Error("상품 분석 정보를 불러오지 못했습니다.");
        }

        // 화면에 렌더링
        setProductData(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [Id]);

  const handleDownloadPDF = () => {
    if (productData?.analysis?.pdf_url) {
      window.location.href = productData.analysis.pdf_url;
    } else {
      console.error("PDF URL이 없습니다.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
            상품 정보를 불러오는 중...
          </div>
        </div>
      </main>
    );
  }

  if (error || !productData) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error || "상품 정보를 찾을 수 없습니다."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        {/* 헤더 */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Product Analysis
            </p>
            <h1 className="font-display text-3xl text-white sm:text-4xl">
              상품 분석 결과
            </h1>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF 다운로드
          </button>
        </header>

        {/* 제품 정보 섹션 */}
        <section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/30">
          <div className="flex items-center gap-6">
            <img
              src={productData.thumbnail_url}
              alt={productData.name}
              className="h-32 w-32 rounded-xl object-cover bg-slate-800 shadow-lg"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {productData.name}
              </h2>
              <p className="text-3xl font-bold text-sky-300">
                {productData.price.toLocaleString()} 원
              </p>
            </div>
          </div>
        </section>

        {/* 분석 결과 섹션 */}
        <section className="space-y-6">
          {/* 요약 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/30">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              요약
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {productData.analysis.product_summary.summary}
            </p>
          </div>

          {/* 긍정적 특징 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              긍정적 특징
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {productData.analysis.product_summary.positive_features}
            </p>
          </div>

          {/* 부정적 특징 */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
              부정적 특징
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {productData.analysis.product_summary.negative_features}
            </p>
          </div>

          {/* 키워드 */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/30">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {productData.analysis.product_summary.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 backdrop-blur"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
