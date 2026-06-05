import IntroCard from "@/components/IntroCard";
import PageHeader from "@/components/PageHeader";

const boards = [
  { name: "공지사항", desc: "유라이온 운영·업데이트 공지", posts: 12 },
  { name: "질문게시판", desc: "이용·기술 문의", posts: 48 },
  { name: "자동화공유", desc: "워크플로·스크립트 공유", posts: 156 },
  { name: "성공사례", desc: "도입·성과 사례", posts: 23 },
  { name: "AI뉴스", desc: "AI·자동화 소식", posts: 67 },
  { name: "개발일지", desc: "플랫폼 개발 기록", posts: 9 },
  { name: "기능제안", desc: "기능·개선 제안", posts: 31 },
  { name: "오류신고", desc: "버그·오류 제보", posts: 14 },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        badge="Community"
        title="커뮤니티"
        description="공지, Q&A, 자동화 공유, 성공 사례 등 주제별 게시판으로 크리에이터와 이용자가 소통하는 공간입니다. (목록 UI만)"
      />

      <IntroCard>
        <ul className="divide-y divide-navy-700">
          {boards.map((board) => (
            <li key={board.name}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-navy-800/40"
              >
                <div>
                  <p className="text-xl font-semibold text-white">{board.name}</p>
                  <p className="text-body-card mt-1 text-slate-400">{board.desc}</p>
                </div>
                <span className="text-body-muted shrink-0">
                  {board.posts}개 글
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-body-muted mt-4">
          게시글 상세·작성 기능은 준비 중입니다.
        </p>
      </IntroCard>
    </div>
  );
}
