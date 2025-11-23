"use client";

import { useMemo, useState } from "react";
import ProductList from "@/components/ProductList";
import { Product } from "@/types/product";

export default function ProductPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "price-asc" | "price-desc">("none");

  const sortedResults = useMemo(() => {
    if (sortOrder === "none") return searchResults;
    const copied = [...searchResults];
    copied.sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      return b.price - a.price;
    });
    return copied;
  }, [searchResults, sortOrder]);

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

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>상품 검색</h1>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px" }} disabled={isLoading}>
          {isLoading ? "검색 중..." : "검색"}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: "#374151", marginRight: 8 }}>정렬:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb" }}
        >
          <option value="none">기본(검색 순)</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
        </select>
      </div>

      {error && <p style={{ marginTop: 12, color: "#dc2626" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        {isLoading ? <p style={{ color: "#6b7280" }}>검색 결과를 불러오는 중...</p> : <ProductList products={sortedResults} />}
      </div>
    </div>
  );
}
