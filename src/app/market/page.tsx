import MarketContent from "@/components/MarketContent";
import PageHeader from "@/components/PageHeader";

export default function MarketPage() {
  return (
    <div className="page-container py-12">
      <PageHeader
        badge="Market"
        title="AI 자동화·창작물·에이전트 거래소"
        description="검증·인증된 AI 자동화, 프롬프트, 워크플로, 에이전트를 카테고리별로 탐색하고 거래하는 마켓입니다. (현재는 설계·더미 상품 화면)"
      />
      <MarketContent />
    </div>
  );
}
