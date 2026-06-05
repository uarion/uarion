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
