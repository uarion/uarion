"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, sortOptions } from "@/lib/market-categories";
import { getSupabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

/** public.products row (setup-products-table.sql) */
type DbProductRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  created_at: string;
};

function mapRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    verificationScore: 0,
    certificationStatus: "검증됨",
    registeredAt: row.created_at.slice(0, 10),
    verificationReport: {
      certificationLabel: "",
      criteria: [],
    },
  };
}

export default function MarketContent() {
  const [category, setCategory] = useState<string>(categories[0]);
  const [sort, setSort] = useState<string>(sortOptions[0].id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await getSupabase()
        .from("products")
        .select("id, title, description, price, category, status, created_at")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

      if (!mounted) {
        return;
      }

      if (queryError) {
        setError(queryError.message || "상품 목록을 불러오지 못했습니다.");
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts((data ?? []).map(mapRowToProduct));
      setLoading(false);
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

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

      {loading ? (
        <p className="text-body-muted py-12 text-center">상품 목록을 불러오는 중…</p>
      ) : error ? (
        <p className="text-body-muted py-12 text-center text-red-300" role="alert">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="text-body-muted py-12 text-center">등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
