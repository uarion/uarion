import type { Metadata } from "next";
import MarketProductDetailClient from "./MarketProductDetailClient";
import { fetchApprovedProductMeta } from "@/lib/productsPublic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchApprovedProductMeta(id);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 — UARION",
      description: "요청하신 상품이 존재하지 않거나 아직 공개되지 않았습니다.",
    };
  }

  const title = `${product.title} — UARION 마켓`;
  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}…`
      : product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/market/${id}`,
      siteName: "UARION",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function MarketProductDetailPage() {
  return <MarketProductDetailClient />;
}
