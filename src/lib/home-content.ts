/** 홈 더미 데이터(숫자·경로·아이콘) — 문구는 src/lib/i18n.ts */

export const HOME_ASSETS = {
  logo: "/logo/uarion_symbol_only.svg",
  planetHero: "/home/uarion-planet-hero.png",
} as const;

/** 통계 — 실제 API 연동 시 value만 교체 */
export const stats = {
  registered: { value: "127", icon: "cube" as const },
  founders: { value: "34", icon: "users" as const },
  beta: { value: "289", icon: "rocket" as const },
  pending: { value: "18", icon: "shield" as const },
} as const;

export type StatKey = keyof typeof stats;

export const statKeys: StatKey[] = ["registered", "founders", "beta", "pending"];

export const socialProof = {
  count: 289,
  avatars: ["김", "이", "박", "최", "정"],
} as const;

export const notificationHref = "/sell";

export const founderBenefitIds = ["fee", "exposure", "badge"] as const;

export const serviceItems = [
  { id: "register", icon: "cube" as const, href: "/registry" },
  { id: "verify", icon: "shield" as const, href: "/certification" },
  { id: "trade", icon: "cart" as const, href: "/market" },
  { id: "grow", icon: "growth" as const, href: "/creators" },
] as const;

export const roadmapSteps = [
  { step: 1, period: "2025 Q4", titleKey: "step1" as const, active: true },
  { step: 2, period: "2026 Q1", titleKey: "step2" as const, active: true },
  { step: 3, period: "2026 Q2", titleKey: "step3" as const, active: false },
  { step: 4, period: "2026 Q3", titleKey: "step4" as const, active: false },
] as const;

export const founderCtaHref = "/sell";

export const founderCtaCardIds = ["badge", "benefits", "history"] as const;

export const ecosystemPartners = [
  "OpenAI",
  "Claude",
  "Gemini",
  "n8n",
  "make",
  "GitHub",
  "stripe",
] as const;

export const footerServiceLinks = [
  { key: "market" as const, href: "/market", badge: "Beta" as const },
  { key: "registry" as const, href: "/registry" },
  { key: "certification" as const, href: "/certification" },
  { key: "creators" as const, href: "/creators" },
] as const;

export const footerCompanyLinks = [
  { key: "about" as const, href: "#" },
  { key: "newsroom" as const, href: "#" },
  { key: "contact" as const, href: "mailto:uarion.team@gmail.com" },
] as const;

export const footerSupportLinks = [
  { key: "guide" as const, href: "#" },
  { key: "faq" as const, href: "#" },
  { key: "supportCenter" as const, href: "#" },
] as const;

export const footerSocialLinks = [
  { label: "X", href: "#" },
  { label: "Discord", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "LinkedIn", href: "#" },
] as const;
