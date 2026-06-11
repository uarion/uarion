"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <h1 className="mb-3 text-xl font-bold text-white">결제에 실패했습니다</h1>
        {message && <p className="text-body text-red-200">{decodeURIComponent(message)}</p>}
        {code && (
          <p className="text-body-muted mt-2 text-sm text-slate-400">코드: {code}</p>
        )}
        <Link
          href="/market"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 hover:bg-accent-hover"
        >
          마켓으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <p className="text-body-muted py-12 text-center">로딩 중…</p>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
