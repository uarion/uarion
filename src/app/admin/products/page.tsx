import AdminProductsPageClient from "@/components/admin/AdminProductsPageClient";

export const metadata = {
  title: "상품 승인 관리 | UARION",
  description: "관리자 전용 상품 승인·거절",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsPageClient />;
}
