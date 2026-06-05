import AdminAuthenticityLabPageClient from "@/components/admin/AdminAuthenticityLabPageClient";

export const metadata = {
  title: "Authenticity Lab | UARION Admin",
  description: "관리자 전용 UARION Authenticity Lab (mock)",
  robots: { index: false, follow: false },
};

export default function AdminAuthenticityLabPage() {
  return <AdminAuthenticityLabPageClient />;
}
