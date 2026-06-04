import Link from "next/link";

const banners = [
  {
    id: "1",
    tag: "공지",
    title: "유라이온 베타 오픈",
    desc: "AI 검증·인증 플랫폼을 준비 중입니다",
    href: "#",
  },
  {
    id: "2",
    tag: "파트너십",
    title: "기관·기업 협업 문의 환영",
    desc: "검증 표준 도입을 함께할 파트너를 찾습니다",
    href: "#",
  },
  {
    id: "3",
    tag: "모집",
    title: "초기 입점 판매자 모집",
    desc: "검증된 첫 판매자가 되어보세요",
    href: "#",
  },
];

const features = [
  {
    title: "검증 점수",
    desc: "등록물마다 객관적 검증 점수가 부여되어 신뢰도를 한눈에 확인할 수 있습니다",
  },
  {
    title: "등록 시점 기록",
    desc: "모든 등록물에 타임스탬프가 기록되어 이력과 시점을 투명하게 추적합니다",
  },
  {
    title: "인증 배지",
    desc: "검증을 통과한 창작물에 인증 배지가 부여되어 거래의 신뢰 기반이 됩니다",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          AI 검증 · 인증 기관
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
          검증된 AI만
          <br />
          <span className="text-accent">거래됩니다</span>
        </h1>
        <p className="mb-4 text-lg leading-relaxed text-slate-400">
          유라이온은 AI 자동화·창작물을 등록·검증·인증하는 신뢰 플랫폼입니다.
          모든 등록물에 검증 점수와 등록 시점이 기록됩니다.
        </p>
        <p className="mb-10 text-sm text-slate-500">
          기록자 → 평가자 → 인증자 → 감정사 — 신뢰가 쌓이는 성장 경로
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg border border-accent/40 bg-accent/10 px-8 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          검증 등록물 보기
        </Link>
      </section>

      <section className="mt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.href}
              className="flex min-h-[5.5rem] flex-col justify-between rounded-lg border border-navy-700 bg-navy-900 px-4 py-3.5 transition-colors hover:border-navy-600 hover:bg-navy-800"
            >
              <span className="mb-2 inline-block w-fit rounded px-2 py-0.5 text-xs font-semibold text-accent ring-1 ring-accent/40">
                {banner.tag}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{banner.title}</p>
                <p className="mt-1.5 text-sm leading-snug text-slate-300">
                  {banner.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-8 sm:grid-cols-3">
        {features.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-navy-700 bg-navy-900 p-6"
          >
            <h2 className="mb-2 text-lg font-semibold text-white">
              {item.title}
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
