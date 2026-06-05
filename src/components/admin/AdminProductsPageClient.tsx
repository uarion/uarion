"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import {
  approveProduct,
  fetchPendingProductsForAdmin,
  rejectProduct,
  type PendingProduct,
} from "@/lib/products";

function formatPrice(price: number) {
  return `${price.toLocaleString()}원`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminProductsPageClient() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProducts = useCallback(async (token: string) => {
    setLoading(true);
    setFeedback(null);
    const result = await fetchPendingProductsForAdmin(token);
    if (result.forbidden) {
      setForbidden(true);
      setProducts([]);
    } else if (result.error) {
      setFeedback(result.error);
      setProducts([]);
    } else {
      setForbidden(false);
      setProducts(result.products);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await getSupabase().auth.getSession();
      if (!mounted) return;

      const token = data.session?.access_token ?? null;
      setAccessToken(token);
      setAuthLoading(false);

      if (!token) {
        setLoading(false);
        return;
      }

      await loadProducts(token);
    }

    init();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
      const token = session?.access_token ?? null;
      setAccessToken(token);
      if (token) {
        await loadProducts(token);
      } else {
        setProducts([]);
        setForbidden(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProducts]);

  async function handleApprove(id: string) {
    if (!accessToken) return;
    setActingId(id);
    setFeedback(null);
    const { error } = await approveProduct(id, accessToken);
    setActingId(null);
    if (error) {
      setFeedback(error);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReject(id: string) {
    if (!accessToken) return;
    setActingId(id);
    setFeedback(null);
    const { error } = await rejectProduct(id, accessToken);
    setActingId(null);
    if (error) {
      setFeedback(error);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (authLoading) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-navy-800" />
          <div className="h-40 rounded-xl bg-navy-900" />
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-navy-700 bg-navy-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">상품 승인 관리</h1>
          <p className="text-body mt-3 text-slate-400">관리자 페이지는 로그인이 필요합니다.</p>
          <Link
            href="/login?next=/admin/products"
            className="mt-6 inline-flex rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 hover:bg-accent-hover"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">권한 없음</h1>
          <p className="text-body mt-3 text-slate-400">
            이 페이지는 관리자만 접근할 수 있습니다.
          </p>
          <Link href="/" className="mt-6 inline-block text-accent hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold text-white">상품 승인 관리</h1>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            승인 대기 {products.length}건
          </span>
        </div>

        {feedback && (
          <div
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="home-card animate-pulse p-8 text-center text-slate-500">불러오는 중…</div>
        ) : products.length === 0 ? (
          <div className="home-card p-8 text-center">
            <p className="text-body text-slate-400">대기 중인 상품이 없습니다.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="home-card p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-white">{product.title}</h2>
                    <p className="text-body mt-2 whitespace-pre-wrap text-slate-400">
                      {product.description || "(설명 없음)"}
                    </p>
                    <dl className="text-body-card mt-4 grid gap-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-500">가격</dt>
                        <dd className="font-medium text-slate-200">{formatPrice(product.price)}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">카테고리</dt>
                        <dd className="font-medium text-slate-200">{product.category}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">등록자</dt>
                        <dd className="font-medium text-slate-200">
                          {product.registrant_email ?? product.user_id.slice(0, 8) + "…"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">등록일</dt>
                        <dd className="font-medium text-slate-200">
                          {formatDate(product.created_at)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={actingId === product.id}
                      onClick={() => handleApprove(product.id)}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-accent-hover disabled:opacity-60"
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      disabled={actingId === product.id}
                      onClick={() => handleReject(product.id)}
                      className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                    >
                      거절
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
