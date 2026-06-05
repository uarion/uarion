"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, sortOptions } from "@/lib/market-categories";
import { dummyProducts } from "@/lib/dummy-products";

export default function MarketContent() {
  const [category, setCategory] = useState<string>(categories[0]);
  const [sort, setSort] = useState<string>(sortOptions[0].id);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label
            htmlFor="category"
            className="text-label mb-2 block"
          >
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-body w-full max-w-md rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="text-label mb-2 block">
            정렬 (준비 중)
          </span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSort(option.id)}
                className={`text-label rounded-lg px-3 py-1.5 transition-colors ${
                  sort === option.id
                    ? "bg-accent/20 text-accent ring-1 ring-accent/40"
                    : "border border-navy-700 bg-navy-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-body-muted mb-6">
        선택: {category} · {sortOptions.find((o) => o.id === sort)?.label} (UI
        자리, 실제 정렬 미적용)
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
