"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import ProductList from "@/components/ProductList";
import { Product } from "@/types/product";

export default function ProductPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "price-asc" | "price-desc">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 5;
  const sortOptions: { value: typeof sortOrder; label: string; sub?: string }[] = [
    { value: "none", label: "기본(검색 순)", sub: "검색 결과 순서 유지" },
    { value: "price-asc", label: "가격 낮은순", sub: "저렴한 상품부터 보기" },
    { value: "price-desc", label: "가격 높은순", sub: "가격이 높은 상품부터 보기" },
  ];

  const sortedResults = useMemo(() => {
    if (sortOrder === "none") return searchResults;
    const copied = [...searchResults];
    copied.sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      return b.price - a.price;
    });
    return copied;
  }, [searchResults, sortOrder]);

  useEffect(() => {
    // 검색 결과가 바뀌면 첫 페이지로 이동
    setCurrentPage(1);
  }, [searchResults]);

  useEffect(() => {
    // 정렬/검색 결과 변화로 총 페이지 수가 줄어든 경우 현재 페이지를 맞춰준다
    setCurrentPage((prev) => {
      const totalPages = Math.max(1, Math.ceil(sortedResults.length / ITEMS_PER_PAGE));
      return Math.min(prev, totalPages);
    });
  }, [sortedResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/search?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "검색에 실패했습니다.");
      }

      setSearchResults((data.results as Product[]) || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedResults.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, sortedResults]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedResults.length / ITEMS_PER_PAGE)),
    [sortedResults]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Product Finder</p>
          <h1 className="font-display text-3xl text-white sm:text-4xl">상품 검색</h1>
          <p className="text-sm text-slate-300">
            원하는 상품을 검색하고 가격순으로 정렬해 보세요.
          </p>
        </header>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="검색어 입력"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400/70 focus:bg-white/10"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                Enter
              </span>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "검색 중..." : "검색"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm" ref={sortRef}>
            <span className="text-slate-400">정렬</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none transition hover:border-sky-400/60 focus:border-sky-400/70"
              >
                {sortOptions.find((opt) => opt.value === sortOrder)?.label ?? "정렬 선택"}
                <span className={`text-xs transition ${isSortOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {isSortOpen && (
                <div className="absolute z-10 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur">
                  {sortOptions.map((opt) => {
                    const active = opt.value === sortOrder;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortOrder(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition ${
                          active
                            ? "bg-sky-500/15 text-sky-200 border-l-2 border-sky-400"
                            : "text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        <div className="text-sm font-semibold">{opt.label}</div>
                        {opt.sub && <div className="text-xs text-slate-400">{opt.sub}</div>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <section className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              검색 결과를 불러오는 중...
            </div>
          ) : (
            <>
              <ProductList products={paginatedResults} />

              {sortedResults.length > ITEMS_PER_PAGE && (
                <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-white/10 px-3 py-2 transition hover:border-sky-400/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="text-slate-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-white/10 px-3 py-2 transition hover:border-sky-400/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
