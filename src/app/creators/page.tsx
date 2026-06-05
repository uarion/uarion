import IntroCard from "@/components/IntroCard";
import PageHeader from "@/components/PageHeader";

const creatorTabs = ["인기 제작자", "신규 제작자", "인증 제작자", "판매 랭킹"];

const dummyCreators = [
  {
    name: "워크플로마스터",
    badge: "인증",
    sales: 128,
    rating: 4.9,
    score: 92,
  },
  {
    name: "프롬프트랩",
    badge: "신규",
    sales: 34,
    rating: 4.7,
    score: 78,
  },
  {
    name: "AutoForge",
    badge: "인기",
    sales: 256,
    rating: 4.8,
    score: 88,
  },
];

export default function CreatorsPage() {
  return (
    <div className="page-container py-12">
      <PageHeader
        badge="Creators"
        title="AI 제작자·판매자"
        description="검증·인증을 통과한 크리에이터를 둘러보고, 판매 실적·평점·UARION Score로 신뢰도를 비교합니다. (설계 소개 화면)"
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {creatorTabs.map((tab, index) => (
          <span
            key={tab}
            className={`text-label rounded-lg px-3 py-1.5 ${
              index === 0
                ? "bg-accent/20 text-accent ring-1 ring-accent/40"
                : "border border-navy-700 bg-navy-800 text-slate-400"
            }`}
          >
            {tab}
          </span>
        ))}
        <span className="text-body-muted self-center">(탭 UI 자리)</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyCreators.map((creator) => (
          <IntroCard key={creator.name}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-lg font-bold text-accent">
                {creator.name.charAt(0)}
              </span>
              <div>
                <h3 className="font-semibold text-white">{creator.name}</h3>
                <span className="text-label text-accent">{creator.badge}</span>
              </div>
            </div>
            <ul className="space-y-2">
              <li>판매 수: {creator.sales}</li>
              <li>평점: {creator.rating} / 5.0</li>
              <li>UARION Score: {creator.score}</li>
            </ul>
          </IntroCard>
        ))}
      </div>
    </div>
  );
}
