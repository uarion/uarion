const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

export type TossConfirmResult = {
  paymentKey: string;
  orderId: string;
  totalAmount: number;
  status: string;
};

export type TossErrorBody = {
  code?: string;
  message?: string;
};

export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<{ ok: true; data: TossConfirmResult } | { ok: false; status: number; message: string }> {
  const secretKey = process.env.TOSS_SECRET_KEY?.trim() ?? "";
  if (!secretKey) {
    return { ok: false, status: 500, message: "TOSS_SECRET_KEY가 설정되지 않았습니다." };
  }

  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

  const response = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const rawText = await response.text();
  let body: TossConfirmResult | TossErrorBody;

  if (!rawText.trim()) {
    console.error("[toss/confirm] empty response body:", response.status);
    return {
      ok: false,
      status: response.status || 502,
      message: "결제 승인 응답이 비어 있습니다.",
    };
  }

  try {
    body = JSON.parse(rawText) as TossConfirmResult | TossErrorBody;
  } catch (err) {
    console.error("[toss/confirm] JSON parse failed:", response.status, err, rawText.slice(0, 200));
    return {
      ok: false,
      status: response.status || 502,
      message: "결제 승인 응답을 해석하지 못했습니다.",
    };
  }

  if (!response.ok) {
    const err = body as TossErrorBody;
    return {
      ok: false,
      status: response.status,
      message: err.message ?? "결제 승인에 실패했습니다.",
    };
  }

  return { ok: true, data: body as TossConfirmResult };
}
