import type { PendingProduct } from "@/lib/products-admin";

export const PRODUCT_CATEGORIES = [
  "프롬프트",
  "플레이북",
  "워크플로우",
  "SVG에셋",
  "자동화설계",
  "설치가이드",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_LIMITS = {
  titleMax: 100,
  descriptionMax: 5000,
  priceMin: 0,
  priceMax: 10_000_000,
} as const;

export type ProductFormValues = {
  title: string;
  description: string;
  price: string;
  category: ProductCategory | "";
};

export function validateProductForm(values: ProductFormValues): string | null {
  const title = values.title.trim();
  if (!title) {
    return "제목을 입력해 주세요.";
  }
  if (title.length > PRODUCT_LIMITS.titleMax) {
    return `제목은 ${PRODUCT_LIMITS.titleMax}자 이하여야 합니다.`;
  }

  if (values.description.length > PRODUCT_LIMITS.descriptionMax) {
    return `설명은 ${PRODUCT_LIMITS.descriptionMax}자 이하여야 합니다.`;
  }

  if (!values.category || !PRODUCT_CATEGORIES.includes(values.category as ProductCategory)) {
    return "카테고리를 선택해 주세요.";
  }

  const priceRaw = values.price.trim();
  if (!priceRaw) {
    return "가격을 입력해 주세요.";
  }
  if (!/^\d+$/.test(priceRaw)) {
    return "가격은 숫자(원)만 입력해 주세요.";
  }
  const price = Number(priceRaw);
  if (price < PRODUCT_LIMITS.priceMin || price > PRODUCT_LIMITS.priceMax) {
    return `가격은 ${PRODUCT_LIMITS.priceMin.toLocaleString()}원 ~ ${PRODUCT_LIMITS.priceMax.toLocaleString()}원 사이여야 합니다.`;
  }

  return null;
}

export type { PendingProduct };

/** UI → 서버 API (관리자 승인 대기 목록) */
export async function fetchPendingProductsForAdmin(accessToken: string): Promise<{
  products: PendingProduct[];
  error: string | null;
  forbidden: boolean;
}> {
  const res = await fetch("/api/admin/products", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 403) {
    return { products: [], error: "관리자 권한이 없습니다.", forbidden: true };
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { products: [], error: body.error ?? "목록을 불러오지 못했습니다.", forbidden: false };
  }

  const body = (await res.json()) as { products: PendingProduct[] };
  return { products: body.products ?? [], error: null, forbidden: false };
}

/** UI → 서버 API (승인) */
export async function approveProduct(
  id: string,
  accessToken: string,
): Promise<{ error: string | null }> {
  const res = await fetch(`/api/admin/products/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { error: body.error ?? "승인에 실패했습니다." };
  }
  return { error: null };
}

/** UI → 서버 API (거절) */
export async function rejectProduct(
  id: string,
  accessToken: string,
): Promise<{ error: string | null }> {
  const res = await fetch(`/api/admin/products/${id}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { error: body.error ?? "거절에 실패했습니다." };
  }
  return { error: null };
}
