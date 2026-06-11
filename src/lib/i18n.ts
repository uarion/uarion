/** UI 번역 — ko 기본, en 전환. 메인·헤더·푸터·플레이북 문구 */

import { authenticityI18n } from "@/lib/i18n-authenticity";
import { playbookI18n } from "@/lib/i18n-playbook";

export type Locale = "ko" | "en";

export const defaultLocale: Locale = "ko";

type L = Record<Locale, string>;

function tr(ko: string, en: string): L {
  return { ko, en };
}

export const i18n = {
  nav: {
    home: tr("홈", "Home"),
    market: tr("마켓", "Market"),
    registry: tr("등록소", "Registry"),
    certification: tr("인증", "Certification"),
    authenticity: tr("진위검증", "Authenticity"),
    playbook: tr("플레이북", "Playbook"),
    creators: tr("크리에이터", "Creators"),
    community: tr("커뮤니티", "Community"),
    founderApply: tr("창립 멤버 되기", "Become a Founder"),
    login: tr("로그인", "Log in"),
    badgeBeta: tr("베타", "Beta"),
    badgeSoon: tr("곧 공개", "Soon"),
    menuOpen: tr("메뉴 열기", "Open menu"),
    menuClose: tr("메뉴 닫기", "Close menu"),
    langKo: tr("KO", "KO"),
    langEn: tr("EN", "EN"),
  },
  hero: {
    label: tr(
      "오픈 액세스 · UARION 창립 멤버 모집",
      "Open Access · UARION Founding Member Recruitment"
    ),
    titleLine1: tr(
      "AI 자산을 등록하고 UARION 인증",
      "Register your AI assets, get UARION certified,"
    ),
    titleLine2: tr("받고 마켓에서 판매하세요", "and sell on the marketplace"),
    description: tr(
      "UARION은 AI 자동화 프로그램, 프롬프트, 플레이북, 템플릿, AI 창작물을 등록·검토·인증하고 판매할 수 있도록 돕는 AI 자산 마켓플레이스입니다. UARION 인증은 플랫폼 내부 기준에 따른 민간 인증 시스템이며, 인증을 통과한 AI 자산에는 UARION 인증 배지가 표시됩니다.",
      "UARION is an AI asset marketplace for registering, reviewing, verifying, and selling automation programs, prompts, playbooks, templates, and creative works. UARION verification is a private certification under platform criteria; verified assets display the UARION badge."
    ),
    ctaFounder: tr("창립 멤버 되기", "Become a Founder"),
    ctaCertStandards: tr("UARION 인증 기준 보기", "View UARION certification standards"),
    socialProof: tr(
      "289명의 초기 신청자가 UARION 창립 멤버 참여를 준비하고 있습니다. (* 예시 데이터입니다)",
      "289 early applicants are preparing to join UARION as founding members. (* Sample data)"
    ),
  },
  certification: {
    badge: tr("UARION 인증", "UARION Certification"),
    title: tr("UARION 인증", "UARION Certification"),
    subtitle: tr(
      "AI 자산을 위한 민간 인증 배지 시스템",
      "Private certification badge system for AI assets"
    ),
    description: tr(
      "UARION 인증은 AI 자산의 신뢰도를 높이기 위한 민간 인증 시스템입니다. UARION은 AI 자산의 기본 정보, 기능 설명, 사용 목적, 제출 자료, 권리 고지, 개인정보 처리 여부, 위험 요소, 판매 적합성을 내부 기준에 따라 검토합니다. 기준을 충족한 AI 자산에는 UARION 인증 배지가 표시됩니다.",
      "UARION certification is a private system to increase trust in AI assets. UARION reviews basic information, feature descriptions, intended use, submitted materials, rights notices, privacy handling, risk factors, and sales suitability against internal criteria. Qualifying assets receive the UARION verification badge."
    ),
    disclaimer: tr(
      "UARION 인증과 UARION 배지는 정부, 공공기관, 국가공인 인증이 아닙니다. UARION 인증은 AI 자산의 성능, 수익, 법적 적합성, 보안성, 저작권 적법성, 개인정보 보호 적합성을 절대적으로 보증하지 않습니다.",
      "UARION certification and the UARION badge are not government, public agency, or nationally accredited certifications. UARION certification does not absolutely guarantee performance, revenue, legal compliance, security, copyright legality, or privacy protection suitability of AI assets."
    ),
    inspectionTitle: tr("검사 항목", "Review items"),
    resultTitle: tr("결과 예시 카드", "Sample result card"),
    verifiedLabel: tr("UARION VERIFIED", "UARION VERIFIED"),
    pipelineNote: tr(
      "실제 검증 파이프라인·리포트 발급은 다음 단계에서 구현됩니다.",
      "The verification pipeline and report issuance will be implemented in a later phase."
    ),
    items: tr(
      "원본성 / AI 생성 여부 / AI 합성 여부 / 저작권 위험도 / 상업적 사용 가능 / 악성 코드 / 프롬프트 유출 / 실행 테스트 / 설치 테스트 / 보안 위험도",
      "Originality / AI-generated disclosure / AI synthesis / Copyright risk / Commercial use / Malware / Prompt leakage / Execution test / Install test / Security risk"
    ),
    resultRows: tr(
      "인증 상태:UARION VERIFIED|Originality:95%|Security:PASS|Commercial Use:YES|Risk Score:3 / 100",
      "Status:UARION VERIFIED|Originality:95%|Security:PASS|Commercial Use:YES|Risk Score:3 / 100"
    ),
  },
  notification: {
    message: tr(
      "마켓플레이스는 곧 오픈됩니다. 현재 창립 멤버 크리에이터를 우선 모집하고 있습니다.",
      "The marketplace opens soon. We are recruiting Founding Member Creators first."
    ),
    link: tr("자세히 보기", "Learn more"),
  },
  stats: {
    registered: tr("등록된 AI", "Registered AI"),
    founders: tr("창립 멤버 크리에이터", "Founding Member Creators"),
    beta: tr("베타 신청자", "Beta applicants"),
    pending: tr("인증 대기", "Pending verification"),
    disclaimer: tr(
      "* 베타 준비 중 예시 수치입니다",
      "* Sample figures while beta is in preparation"
    ),
  },
  founderBenefits: {
    sectionTitle: tr("창립 멤버 혜택", "Founder Benefits"),
    fee: {
      title: tr("평생 수수료 할인", "Lifetime fee discount"),
      desc: tr("거래 수수료 평생 50%", "50% off trading fees for life"),
    },
    exposure: {
      title: tr("메인 노출 우선권", "Priority main placement"),
      desc: tr("신규 AI 메인 우선 노출", "New listings featured on the homepage"),
    },
    badge: {
      title: tr("창립 멤버 배지 지급", "Founder badge"),
      desc: tr("공식 창립 멤버 배지", "Official Founder badge on your profile"),
    },
  },
  services: {
    sectionTitle: tr("UARION이 하는 일", "What UARION does"),
    learnMore: tr("자세히 보기 →", "Learn more →"),
    register: {
      title: tr("AI 등록", "AI registration"),
      desc: tr(
        "프롬프트·워크플로·에이전트를 등록소에 기록하고 버전을 관리합니다.",
        "Record and version prompts, workflows, and agents in the registry."
      ),
    },
    verify: {
      title: tr("AI 인증", "AI verification"),
      desc: tr(
        "원본성·보안·실행 검증 후 UARION 인증 배지를 부여합니다.",
        "Verify originality, security, and execution—then earn the UARION badge."
      ),
    },
    trade: {
      title: tr("AI 거래", "AI marketplace"),
      desc: tr(
        "검증된 AI만 거래하는 마켓플레이스 (베타 준비 중).",
        "Trade verified AI only (marketplace in beta)."
      ),
    },
    grow: {
      title: tr("AI 성장", "Creator growth"),
      desc: tr(
        "크리에이터 성장·수익·커뮤니티를 지원합니다.",
        "Support creators with growth tools, revenue, and community."
      ),
    },
  },
  roadmap: {
    sectionTitle: tr("UARION 로드맵", "UARION Roadmap"),
    viewAll: tr("전체 로드맵 보기 →", "View full roadmap →"),
    step1: tr("크리에이터 모집", "Creator recruitment"),
    step2: tr("AI 등록소", "AI Registry"),
    step3: tr("AI 인증", "AI Verified"),
    step4: tr("마켓플레이스", "Marketplace"),
  },
  founderCta: {
    title: tr("지금 창립 멤버 크리에이터에 참여하세요", "Join as a Founding Member Creator now"),
    desc: tr(
      "당신의 이름이 UARION 최초의 창작자로 기록됩니다.",
      "Your name will be recorded among UARION’s first creators."
    ),
    apply: tr("창립 멤버 되기", "Become a Founder"),
    cards: {
      badge: {
        tag: tr("창립 멤버 배지", "FOUNDER BADGE"),
        title: tr("공식 배지 & 인증", "Official badge & verification"),
      },
      benefits: {
        tag: tr("초기 혜택", "EARLY BENEFITS"),
        title: tr("다양한 창립자 혜택", "Founding member perks"),
      },
      history: {
        tag: tr("역사에 기록", "ON THE RECORD"),
        title: tr("UARION 역사 영구 기록", "Permanent place in UARION history"),
      },
    },
  },
  ecosystem: {
    title: tr("호환 생태계", "Compatible Ecosystem"),
  },
  footer: {
    tagline1: tr("AI 시대의 신뢰 레이어.", "The Trust Layer for AI."),
    tagline2: tr("등록하고, 검증하고, 거래하세요.", "Build. Verify. Trade AI."),
    service: tr("서비스", "Services"),
    company: tr("회사", "Company"),
    support: tr("지원", "Support"),
    newsletter: tr("UARION 뉴스레터", "UARION Newsletter"),
    newsletterNote: tr("샘플 UI · 구독 기능 준비 중", "Sample UI · Subscribe coming soon"),
    emailPlaceholder: tr("이메일 주소", "Email address"),
    subscribe: tr("구독 (준비 중)", "Subscribe (coming soon)"),
    legalDisclaimer: tr(
      "UARION 인증은 국가공인 인증이 아닌 민간 인증 시스템입니다. UARION은 플랫폼 내부 기준에 따라 AI 자산의 제출 자료와 기본 정보를 검토하며, 인증 배지는 성능, 수익, 법적 적합성, 보안성, 저작권 적법성을 절대적으로 보증하지 않습니다.",
      "UARION certification is a private system, not a government-accredited certification. UARION reviews submitted materials and basic information under internal platform criteria; the badge does not absolutely guarantee performance, revenue, legal compliance, security, or copyright legality."
    ),
    copyright: tr("© 2026 UARION. 모든 권리 보유.", "© 2026 UARION. All rights reserved."),
    legalNav: tr("법적 고지", "Legal"),
    links: {
      market: tr("마켓", "Market"),
      registry: tr("등록소", "Registry"),
      certification: tr("인증", "Certification"),
      creators: tr("크리에이터", "Creators"),
      about: tr("회사 소개", "About us"),
      newsroom: tr("뉴스룸", "Newsroom"),
      contact: tr("문의하기", "Contact"),
      guide: tr("이용 가이드", "User guide"),
      faq: tr("자주 묻는 질문", "FAQ"),
      supportCenter: tr("고객센터", "Support center"),
      terms: tr("이용약관", "Terms of Service"),
      privacy: tr("개인정보처리방침", "Privacy Policy"),
    },
  },
  auth: {
    profile: tr("내 정보", "My profile"),
    signOut: tr("로그아웃", "Sign out"),
    accountMenu: tr("계정 메뉴", "Account menu"),
  },
  playbook: playbookI18n,
  authenticity: authenticityI18n,
} as const;

export type I18nTree = typeof i18n;

/** locale에 맞는 문자열 반환 */
export function pick<T extends L>(block: T, locale: Locale): string {
  return block[locale];
}
