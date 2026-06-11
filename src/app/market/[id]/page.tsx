"use client";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { readApiJsonResponse } from "@/lib/parseApiResponse";
import { requestProductDownloadUrl, startFileDownload } from "@/lib/productDownload";
import { getSupabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

type DbProductRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export default function MarketProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);
      setProduct(null);

      const { data, error } = await getSupabase()
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("status", "APPROVED")
        .single();

      if (!mounted) {
        return;
      }

      if (error || !data) {
        setNotFound(true);
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(mapRowToProduct(data as DbProductRow));
      setLoading(false);
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await getSupabase().auth.getSession();
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!id || !user) {
      setHasPurchased(false);
      setCheckingPurchase(false);
      return;
    }

    let mounted = true;
    setCheckingPurchase(true);

    async function checkPurchase() {
      const { data, error } = await getSupabase()
        .from("purchases")
        .select("id")
        .eq("product_id", id)
        .eq("status", "PAID")
        .maybeSingle();

      if (!mounted) {
        return;
      }

      if (error) {
        setHasPurchased(false);
        setCheckingPurchase(false);
        return;
      }

      setHasPurchased(Boolean(data));
      setCheckingPurchase(false);
    }

    checkPurchase();

    return () => {
      mounted = false;
    };
  }, [id, user]);

  async function handleDownload() {
    if (!product) {
      return;
    }

    setDownloadError(null);

    const { data: sessionData } = await getSupabase().auth.getSession();
    const session = sessionData.session;

    if (!session?.user) {
      router.push(`/login?next=/market/${product.id}`);
      return;
    }

    setDownloading(true);

    try {
      const result = await requestProductDownloadUrl(product.id, session.access_token);
      if (!result.ok) {
        setDownloadError(result.message);
        return;
      }

      startFileDownload(result.url);
    } finally {
      setDownloading(false);
    }
  }

  async function handlePurchase() {
    if (!product) {
      return;
    }

    setPayError(null);

    const { data: sessionData } = await getSupabase().auth.getSession();
    const session = sessionData.session;

    if (!session?.user) {
      router.push(`/login?next=/market/${product.id}`);
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim();
    if (!clientKey) {
      setPayError("결제 설정이 올바르지 않습니다. 관리자에게 문의해 주세요.");
      return;
    }

    setPaying(true);

    try {
      const prepareRes = await fetch("/api/payment/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const prepareParsed = await readApiJsonResponse<{
        error?: string;
        orderId?: string;
        orderName?: string;
        amount?: number;
      }>(prepareRes, "결제 준비");

      if (!prepareParsed.ok) {
        setPayError(prepareParsed.message);
        return;
      }

      const prepareBody = prepareParsed.data;
      if (!prepareBody.orderId || prepareBody.amount == null || !prepareBody.orderName) {
        setPayError("결제 준비 실패: 서버 응답에 주문 정보가 없습니다.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: session.user.id });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: prepareBody.amount,
        },
        orderId: prepareBody.orderId,
        orderName: prepareBody.orderName,
        customerEmail: session.user.email ?? undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "결제창을 열지 못했습니다.";
      if (!message.includes("USER_CANCEL") && !message.includes("취소")) {
        setPayError(message);
      }
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/market"
          className="text-body mb-8 inline-block text-slate-400 transition-colors hover:text-accent"
        >
          ← 마켓 목록으로
        </Link>
        <p className="text-body-muted py-12 text-center">상품 정보를 불러오는 중…</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/market"
          className="text-body mb-8 inline-block text-slate-400 transition-colors hover:text-accent"
        >
          ← 마켓 목록으로
        </Link>
        <p className="text-body-muted py-12 text-center">상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { verificationReport } = product;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/market"
        className="text-body mb-8 inline-block text-slate-400 transition-colors hover:text-accent"
      >
        ← 마켓 목록으로
      </Link>

      <article className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900">
        <div className="flex h-48 items-center justify-center bg-navy-800">
          <span className="text-6xl text-navy-700">◆</span>
        </div>
        <div className="p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-label rounded-md bg-navy-800 px-2.5 py-1 font-semibold text-accent ring-1 ring-accent/25">
              검증점수 {product.verificationScore}
            </span>
            <span className="text-label rounded-md bg-navy-800 px-2.5 py-1 text-slate-400 ring-1 ring-navy-600">
              {product.certificationStatus}
            </span>
          </div>
          <p className="text-body-muted mb-2">상품 ID: {product.id}</p>
          <h1 className="mb-4 text-3xl font-bold text-white">{product.title}</h1>
          <p className="mb-8 text-2xl font-semibold text-slate-300">
            ₩{formatPrice(product.price)}
          </p>
          <h2 className="text-label mb-2 uppercase tracking-wide text-slate-500">
            상품 설명
          </h2>
          <p className="text-body-card text-slate-300">{product.description}</p>

          <section className="mt-10 rounded-lg border border-navy-700 bg-navy-950/60 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">검증 리포트</h2>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">
                {product.verificationScore}
              </span>
              <span className="text-slate-500">/ 100</span>
              <span className="text-label ml-2 text-slate-500">검증 점수</span>
            </div>

            <ul className="mb-6 space-y-4">
              {verificationReport.criteria.map((criterion) => (
                <li
                  key={criterion.label}
                  className="border-b border-navy-700/80 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-body-card font-medium text-slate-300">
                      {criterion.label}
                    </span>
                    <span className="text-body-card font-semibold text-accent">
                      {criterion.score}점
                    </span>
                  </div>
                  <p className="text-body-muted mt-1">{criterion.note}</p>
                </li>
              ))}
            </ul>

            <p className="text-body-card mb-2 text-slate-400">
              {verificationReport.certificationLabel}
            </p>
            <p className="text-body-muted">
              등록 시점: {product.registeredAt} (기록됨)
            </p>
          </section>

          {payError && (
            <p className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
              {payError}
            </p>
          )}

          {downloadError && (
            <p className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
              {downloadError}
            </p>
          )}

          {hasPurchased ? (
            <button
              type="button"
              disabled={downloading || checkingPurchase}
              onClick={handleDownload}
              className="mt-10 w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? "다운로드 준비 중…" : "다운로드"}
            </button>
          ) : (
            <button
              type="button"
              disabled={paying || checkingPurchase}
              onClick={handlePurchase}
              className="mt-10 w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? "결제 준비 중…" : user ? "구매하기" : "로그인 후 구매하기"}
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
