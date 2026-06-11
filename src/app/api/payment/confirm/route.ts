import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { confirmTossPayment } from "@/lib/tossPaymentsServer";
import { verifyUserBearerToken } from "@/lib/userAuth";

type ConfirmBody = {
  paymentKey?: string;
  orderId?: string;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyUserBearerToken(request.headers.get("Authorization"));
    if (!auth.ok) {
      console.error("[payment/confirm] auth failed:", auth.status, auth.message);
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    let body: ConfirmBody;
    try {
      body = (await request.json()) as ConfirmBody;
    } catch {
      console.error("[payment/confirm] invalid JSON body");
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const paymentKey = body.paymentKey?.trim();
    const orderId = body.orderId?.trim();

    if (!paymentKey || !orderId) {
      console.error("[payment/confirm] missing paymentKey or orderId");
      return NextResponse.json(
        { error: "paymentKey와 orderId가 필요합니다." },
        { status: 400 },
      );
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (err) {
      console.error("[payment/confirm] Supabase admin init failed:", err);
      return NextResponse.json(
        {
          error:
            "서버 Supabase 설정 오류입니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.",
        },
        { status: 500 },
      );
    }

    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .select("id, buyer_id, product_id, amount, order_id, payment_key, status")
      .eq("order_id", orderId)
      .single();

    if (purchaseError || !purchase) {
      console.error("[payment/confirm] purchase lookup failed:", {
        orderId,
        code: purchaseError?.code,
        message: purchaseError?.message,
      });
      return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
    }

    if (purchase.buyer_id !== auth.user.id) {
      console.error("[payment/confirm] buyer mismatch:", {
        orderId,
        buyerId: purchase.buyer_id,
        userId: auth.user.id,
      });
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (purchase.status === "PAID") {
      return NextResponse.json({
        ok: true,
        orderId: purchase.order_id,
        amount: purchase.amount,
        productId: purchase.product_id,
        alreadyPaid: true,
      });
    }

    if (purchase.status !== "PENDING") {
      console.error("[payment/confirm] invalid purchase status:", {
        orderId,
        status: purchase.status,
      });
      return NextResponse.json({ error: "처리할 수 없는 주문 상태입니다." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price, status")
      .eq("id", purchase.product_id)
      .single();

    if (productError || !product || product.status !== "APPROVED") {
      console.error("[payment/confirm] product lookup failed:", {
        productId: purchase.product_id,
        code: productError?.code,
        message: productError?.message,
        status: product?.status,
      });
      return NextResponse.json({ error: "상품 정보를 확인할 수 없습니다." }, { status: 400 });
    }

    if (purchase.amount !== product.price) {
      console.error("[payment/confirm] amount mismatch:", {
        orderId,
        purchaseAmount: purchase.amount,
        productPrice: product.price,
      });
      return NextResponse.json({ error: "주문 금액이 일치하지 않습니다." }, { status: 400 });
    }

    const confirmedAmount = product.price;

    const toss = await confirmTossPayment(paymentKey, orderId, confirmedAmount);
    if (!toss.ok) {
      console.error("[payment/confirm] Toss confirm failed:", {
        orderId,
        status: toss.status,
        message: toss.message,
      });
      await supabase
        .from("purchases")
        .update({ status: "FAILED" })
        .eq("id", purchase.id)
        .eq("status", "PENDING");

      return NextResponse.json({ error: toss.message }, { status: toss.status });
    }

    if (toss.data.totalAmount !== confirmedAmount) {
      console.error("[payment/confirm] Toss amount mismatch:", {
        orderId,
        expected: confirmedAmount,
        actual: toss.data.totalAmount,
      });
      return NextResponse.json({ error: "결제 금액 검증에 실패했습니다." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("purchases")
      .update({
        status: "PAID",
        payment_key: paymentKey,
      })
      .eq("id", purchase.id)
      .eq("status", "PENDING");

    if (updateError) {
      console.error("[payment/confirm] purchase update failed:", {
        orderId,
        code: updateError.code,
        message: updateError.message,
      });
      return NextResponse.json(
        { error: updateError.message || "구매 기록 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: purchase.order_id,
      amount: confirmedAmount,
      paymentKey,
      productId: purchase.product_id,
    });
  } catch (err) {
    console.error("[payment/confirm] unhandled error:", err);
    return NextResponse.json({ error: "결제 승인 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
