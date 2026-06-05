type L = Record<"ko" | "en", string>;

function tr(ko: string, en: string): L {
  return { ko, en };
}

/** /playbook 페이지 문구 */
export const playbookI18n = {
  disclaimer: tr("* 예시 데이터입니다", "* Sample data for illustration only"),
  comingSoon: tr("준비 중", "Coming soon"),

  hero: {
    headline: tr(
      "AI는 도구가 아닙니다. 검증된 제작 노하우가 경쟁력입니다.",
      "AI is not just a tool. Verified craft is your edge."
    ),
    sub: tr(
      "AI 자동화, 워크플로우, 프롬프트, 운영 전략까지. 실제 Creator들이 사용하고 검증한 Playbook을 만나보세요.",
      "From automation and workflows to prompts and ops—discover Playbooks verified by real creators."
    ),
    tagline: tr("배우고 · 구축하고 · 수익화하세요", "Learn · Build · Monetize"),
    badge: tr("Build · Verify · Share · Monetize", "Build · Verify · Share · Monetize"),
  },

  featured: {
    title: tr("추천 Playbook", "Featured Playbooks"),
    cardA: {
      title: tr("AI 쇼츠 자동화 시스템", "AI Shorts Automation System"),
      rating: tr("★4.9", "★4.9"),
      stat: tr("조회수 12,438", "12,438 views"),
      creator: tr("Creator: UARION Official", "Creator: UARION Official"),
      cta: tr("무료 보기", "View free"),
    },
    cardB: {
      title: tr("n8n AI Agent 구축법", "Building n8n AI Agents"),
      rating: tr("★5.0", "★5.0"),
      stat: tr("다운로드 3,102", "3,102 downloads"),
      premium: tr("Premium", "Premium"),
    },
  },

  automation: {
    title: tr("AI 자동화", "AI Automation"),
    intro: tr(
      "실무에서 바로 사용할 수 있는 자동화 구축 노하우.",
      "Hands-on automation know-how you can deploy today."
    ),
    tags: tr(
      "n8n / Make / Zapier / Claude Code / GPT API / Gemini API / Telegram Bot / Discord Bot",
      "n8n / Make / Zapier / Claude Code / GPT API / Gemini API / Telegram Bot / Discord Bot"
    ),
    exampleTitle: tr("블로그 자동발행 시스템", "Blog Auto-Publishing System"),
    difficulty: tr("설치 난이도 ★★★", "Setup difficulty ★★★"),
    buildTime: tr("예상 구축시간 2시간", "Est. build time: 2 hours"),
    commercial: tr("상업적 이용 가능", "Commercial use allowed"),
    download: tr("다운로드", "Download"),
  },

  workflow: {
    title: tr("워크플로우 설계", "Workflow Design"),
    intro: tr(
      "자동화 구조를 어떻게 설계하는지 설명합니다.",
      "How to architect automation pipelines end to end."
    ),
    flow: tr(
      "Google Sheets → Make → Claude → Flux → Kling → Shotstack → YouTube",
      "Google Sheets → Make → Claude → Flux → Kling → Shotstack → YouTube"
    ),
    materials: tr(
      "구조도 / JSON / API 연결법 / DB 설계 / 예외처리 / 비용 최적화",
      "Diagrams / JSON / API wiring / DB design / Error handling / Cost optimization"
    ),
  },

  prompts: {
    title: tr("프롬프트 엔지니어링", "Prompt Engineering"),
    intro: tr(
      "좋은 결과는 좋은 프롬프트에서 시작됩니다.",
      "Great outputs start with great prompts."
    ),
    categories: tr(
      "이미지 생성 / 영상 생성 / 코딩 / 마케팅 / 블로그 / 광고배너 / AI Agent / 고객상담",
      "Image / Video / Coding / Marketing / Blog / Ad banners / AI Agent / Support"
    ),
    exampleTitle: tr("Flux Ultra Banner Prompt Pack", "Flux Ultra Banner Prompt Pack"),
    packSize: tr("50개 Prompt", "50 prompts"),
    abTest: tr("A/B 테스트 완료", "A/B tested"),
    ctr: tr("CTR 향상 검증", "CTR uplift verified"),
    commercial: tr("상업적 이용 가능", "Commercial use allowed"),
  },

  saas: {
    title: tr("AI SaaS 구축", "Building AI SaaS"),
    intro: tr(
      "AI 서비스를 실제 제품으로 만드는 방법.",
      "Turn AI capabilities into shippable products."
    ),
    stack: tr(
      "FastAPI / Railway / Docker / Redis / PostgreSQL / Stripe / PortOne / Cloudflare / GitHub Actions",
      "FastAPI / Railway / Docker / Redis / PostgreSQL / Stripe / PortOne / Cloudflare / GitHub Actions"
    ),
    exampleTitle: tr("AI Marketplace MVP", "AI Marketplace MVP"),
    includes: tr(
      "포함: 로그인·결제·상품등록·인증시스템·관리자페이지·배포가이드",
      "Includes: auth, payments, listings, verification, admin, deploy guide"
    ),
  },

  ops: {
    title: tr("운영 노하우", "Operations Know-how"),
    intro: tr(
      "실제 서비스를 운영하며 얻은 경험을 공유합니다.",
      "Lessons from running real AI services in production."
    ),
    categories: tr(
      "사용자 확보 / 파운더 모집 / 베타 운영 / 가격 정책 / AI 비용 절감 / 서버 안정화 / 해외 진출",
      "User growth / Founder recruitment / Beta ops / Pricing / AI cost control / Reliability / Global expansion"
    ),
    exampleTitle: tr("파운더 300명 모집 전략", "Founder 300 Recruitment Playbook"),
    exampleDesc: tr(
      "초기 신뢰 확보·인증 시스템 활용·커뮤니티 운영·SNS 바이럴·성과 분석",
      "Trust building, verification, community, social virality, analytics"
    ),
  },

  creator: {
    title: tr("Creator 공개자료", "Creator Resources"),
    intro: tr(
      "Creator들이 자신의 자료를 직접 공유합니다.",
      "Creators publish and share their own materials."
    ),
    uploadTypes: tr(
      "PDF / Workflow / JSON / Prompt Pack / SVG / PPT / Template / Source Code / Guide Book",
      "PDF / Workflow / JSON / Prompt Pack / SVG / PPT / Template / Source Code / Guide Book"
    ),
    cardName: tr("UARION Official", "UARION Official"),
    verified: tr("Verified Creator", "Verified Creator"),
    materials: tr("자료 28개", "28 resources"),
    rating: tr("평점 5.0", "Rating 5.0"),
    followers: tr("팔로워 2,319명", "2,319 followers"),
    follow: tr("팔로우", "Follow"),
  },

  premium: {
    title: tr("Premium", "Premium"),
    intro: tr("검증된 고급 Playbook.", "Verified advanced Playbooks."),
    exampleTitle: tr("AI 쇼츠 반자동 시스템", "AI Shorts Semi-Auto System"),
    difficulty: tr("난이도 Expert", "Difficulty: Expert"),
    includes: tr(
      "포함: 설계도·Workflow·Prompt·설치 가이드·운영 매뉴얼",
      "Includes: blueprint, workflow, prompts, install guide, ops manual"
    ),
    price: tr("149,000원", "₩149,000"),
  },

  verify: {
    title: tr("PLAYBOOK 인증 시스템", "PLAYBOOK Verification"),
    headline: tr(
      "강의가 아닙니다. UARION VERIFIED PLAYBOOK.",
      "Not a course. UARION VERIFIED PLAYBOOK."
    ),
    note: tr(
      "설계 소개 화면입니다. 실제 심사·등록 파이프라인은 다음 단계에서 구현됩니다.",
      "Design preview only. Review and registry pipelines ship in a later phase."
    ),
    auditTitle: tr("심사 항목", "Review criteria"),
    checks: tr(
      "실제 작동 검증 / 설명 문서 포함 / 바이러스 검사 / AI 생성 여부 표시 / 상업적 이용 가능 여부 / 업데이트 지원 여부 / 제작자 신원 인증",
      "Working proof / Documentation / Malware scan / AI-generated disclosure / Commercial use / Update support / Creator identity"
    ),
    passTitle: tr("통과 시 표시", "When approved"),
    passItems: tr(
      "🏆 VERIFIED PLAYBOOK / 검증 완료 / UARION Registry 등록 / 고유 Registry ID 발급 / Version History 관리",
      "🏆 VERIFIED PLAYBOOK / Verified / UARION Registry / Unique Registry ID / Version history"
    ),
  },

  about: {
    title: tr("Playbook이란?", "What is a Playbook?"),
    body: tr(
      "Playbook은 단순한 강의가 아닙니다. 실제 Creator들이 구축하고 운영하며 검증한 AI 자동화 구조, 프롬프트, 워크플로우, 운영 전략을 공유하는 지식 레지스트리입니다. 모든 Premium Playbook은 UARION의 검증 절차를 거쳐 등록됩니다.",
      "A Playbook is not just a course—it is a knowledge registry of automation, prompts, workflows, and ops strategies built and verified by creators. Every Premium Playbook goes through UARION verification before registry."
    ),
  },
} as const;
