import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyUserBearerToken } from "@/lib/userAuth";
import { isValidUuid } from "@/lib/validate-id";

const PRODUCT_FILES_BUCKET = "product-files";
const SIGNED_URL_EXPIRES_SEC = 60;

type RouteContext = { params: Promise<{ productId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { productId: rawProductId } = await context.params;
    const productId = rawProductId?.trim();

    if (!productId || !isValidUuid(productId)) {
      console.error("[download] invalid productId:", rawProductId);
      return NextResponse.json({ error: "유효하지 않은 상품 ID입니다." }, { status: 400 });
    }

    const auth = await verifyUserBearerToken(request.headers.get("Authorization"));
    if (!auth.ok) {
      console.error("[download] auth failed:", auth.status, auth.message);
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (err) {
      console.error("[download] Supabase admin init failed:", err);
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
      .select("id")
      .eq("buyer_id", auth.user.id)
      .eq("product_id", productId)
      .eq("status", "PAID")
      .maybeSingle();

    if (purchaseError) {
      console.error("[download] purchase lookup failed:", {
        productId,
        userId: auth.user.id,
        code: purchaseError.code,
        message: purchaseError.message,
      });
      return NextResponse.json({ error: "구매 내역 확인에 실패했습니다." }, { status: 500 });
    }

    if (!purchase) {
      console.error("[download] no paid purchase:", { productId, userId: auth.user.id });
      return NextResponse.json({ error: "구매 내역이 없습니다." }, { status: 403 });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("file_path, status")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("[download] product lookup failed:", {
        productId,
        code: productError?.code,
        message: productError?.message,
      });
      return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
    }

    if (product.status !== "APPROVED") {
      console.error("[download] product not approved:", { productId, status: product.status });
      return NextResponse.json({ error: "다운로드할 수 없는 상품입니다." }, { status: 400 });
    }

    const filePath = product.file_path?.trim();
    if (!filePath) {
      console.error("[download] missing file_path:", { productId });
      return NextResponse.json({ error: "다운로드 가능한 파일이 없습니다." }, { status: 404 });
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(PRODUCT_FILES_BUCKET)
      .createSignedUrl(filePath, SIGNED_URL_EXPIRES_SEC);

    if (signError || !signed?.signedUrl) {
      console.error("[download] signed URL failed:", {
        productId,
        filePath,
        code: signError?.name,
        message: signError?.message,
      });
      return NextResponse.json({ error: "다운로드 URL 생성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ url: signed.signedUrl });
  } catch (err) {
    console.error("[download] unhandled error:", err);
    return NextResponse.json({ error: "다운로드 처리 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
