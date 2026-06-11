import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <p className="text-body-muted py-12 text-center">결제를 확인하는 중입니다…</p>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
