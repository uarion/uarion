import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyUserBearerToken } from "@/lib/userAuth";

type PrepareBody = {
  productId?: string;
};

function createOrderId(): string {
  return `order_${crypto.randomUUID().replace(/-/g, "")}`;
}

export async function POST(request: Request) {
  try {
    const auth = await verifyUserBearerToken(request.headers.get("Authorization"));
    if (!auth.ok) {
      console.error("[payment/prepare] auth failed:", auth.status, auth.message);
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() ?? "";
    if (!clientKey) {
      console.error("[payment/prepare] NEXT_PUBLIC_TOSS_CLIENT_KEY is missing");
      return NextResponse.json(
        { error: "NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    let body: PrepareBody;
    try {
      body = (await request.json()) as PrepareBody;
    } catch {
      console.error("[payment/prepare] invalid JSON body");
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const productId = body.productId?.trim();
    if (!productId) {
      console.error("[payment/prepare] missing productId");
      return NextResponse.json({ error: "productId가 필요합니다." }, { status: 400 });
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (err) {
      console.error("[payment/prepare] Supabase admin init failed:", err);
      return NextResponse.json(
        {
          error:
            "서버 Supabase 설정 오류입니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.",
        },
        { status: 500 },
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, title, price, status, user_id")
      .eq("id", productId)
      .eq("status", "APPROVED")
      .single();

    if (productError || !product) {
      console.error("[payment/prepare] product lookup failed:", {
        productId,
        code: productError?.code,
        message: productError?.message,
      });
      return NextResponse.json({ error: "구매할 수 없는 상품입니다." }, { status: 404 });
    }

    if (product.user_id === auth.user.id) {
      console.error("[payment/prepare] buyer is seller:", { productId, userId: auth.user.id });
      return NextResponse.json({ error: "본인이 등록한 상품은 구매할 수 없습니다." }, { status: 400 });
    }

    const orderId = createOrderId();

    const { error: insertError } = await supabase.from("purchases").insert({
      buyer_id: auth.user.id,
      product_id: product.id,
      amount: product.price,
      order_id: orderId,
      status: "PENDING",
    });

    if (insertError) {
      console.error("[payment/prepare] purchase insert failed:", {
        productId,
        orderId,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
      return NextResponse.json(
        { error: insertError.message || "주문 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      clientKey,
      orderId,
      orderName: product.title,
      amount: product.price,
    });
  } catch (err) {
    console.error("[payment/prepare] unhandled error:", err);
    return NextResponse.json({ error: "결제 준비 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
