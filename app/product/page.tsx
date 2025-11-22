"use client";

import { useState } from "react";

export default function ProductPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/search?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await res.json();
      console.log(data);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
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
        <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
          검색
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul style={{ marginTop: "20px", padding: 0, listStyle: "none" }}>
          {searchResults.map((item, idx) => (
            <li
              key={idx}
              style={{
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            >
              {item?.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
