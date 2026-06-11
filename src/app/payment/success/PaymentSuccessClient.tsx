"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { readApiJsonResponse } from "@/lib/parseApiResponse";
import { requestProductDownloadUrl, startFileDownload } from "@/lib/productDownload";
import { getSupabase } from "@/lib/supabaseClient";

type ConfirmState =
  | { phase: "loading" }
  | { phase: "success"; orderId: string; amount: number; productId: string }
  | { phase: "error"; message: string };

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<ConfirmState>({ phase: "loading" });
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function confirmPayment() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");

      if (!paymentKey || !orderId) {
        if (mounted) {
          setState({ phase: "error", message: "결제 정보가 올바르지 않습니다." });
        }
        return;
      }

      const { data: sessionData } = await getSupabase().auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ paymentKey, orderId }),
      });

      const parsed = await readApiJsonResponse<{
        error?: string;
        ok?: boolean;
        orderId?: string;
        amount?: number;
        productId?: string;
      }>(res, "결제 승인");

      if (!mounted) {
        return;
      }

      if (!parsed.ok) {
        setState({ phase: "error", message: parsed.message });
        return;
      }

      const body = parsed.data;
      if (!body.ok || !body.productId) {
        setState({
          phase: "error",
          message: body.error ?? "결제 승인 실패: 서버 응답이 올바르지 않습니다.",
        });
        return;
      }

      setState({
        phase: "success",
        orderId: body.orderId ?? orderId,
        amount: body.amount ?? 0,
        productId: body.productId,
      });
    }

    confirmPayment();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  async function handleDownload(productId: string) {
    setDownloadError(null);
    setDownloading(true);

    try {
      const { data: sessionData } = await getSupabase().auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      const result = await requestProductDownloadUrl(productId, accessToken);
      if (!result.ok) {
        setDownloadError(result.message);
        return;
      }

      startFileDownload(result.url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      {state.phase === "loading" && (
        <p className="text-body-muted py-12 text-center">결제를 확인하는 중입니다…</p>
      )}

      {state.phase === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="mb-3 text-xl font-bold text-white">결제 승인 실패</h1>
          <p className="text-body text-red-200">{state.message}</p>
          <Link
            href="/market"
            className="mt-6 inline-block text-accent hover:text-accent-hover"
          >
            마켓으로 돌아가기
          </Link>
        </div>
      )}

      {state.phase === "success" && (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-8 text-center">
          <h1 className="mb-3 text-xl font-bold text-white">결제가 완료되었습니다</h1>
          <p className="text-body text-slate-300">
            주문번호: {state.orderId}
            <br />
            결제 금액: {state.amount.toLocaleString()}원
          </p>

          {downloadError && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
              {downloadError}
            </p>
          )}

          <button
            type="button"
            disabled={downloading}
            onClick={() => handleDownload(state.productId)}
            className="mt-6 w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? "다운로드 준비 중…" : "파일 다운로드"}
          </button>

          <Link
            href={`/market/${state.productId}`}
            className="mt-4 inline-block text-accent hover:text-accent-hover"
          >
            상품 페이지로 이동
          </Link>
        </div>
      )}
    </div>
  );
}
