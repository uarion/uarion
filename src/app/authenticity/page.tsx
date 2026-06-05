import AuthenticityPageClient from "@/components/authenticity/AuthenticityPageClient";

export const metadata = {
  title: "UARION 진위검증",
  description: "AI 합성·딥페이크·음성 클론 위험 분석 소개 (정적 페이지)",
};

export default function AuthenticityPage() {
  return <AuthenticityPageClient />;
}
