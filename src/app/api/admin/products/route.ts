import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { fetchPendingProducts } from "@/lib/products-admin";

export async function GET(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const { products, error } = await fetchPendingProducts();
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ products });
  } catch (e) {
    const message = e instanceof Error ? e.message : "서버 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
