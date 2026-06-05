export const categories = [
  "전체",
  "프롬프트",
  "AI에이전트",
  "n8n워크플로우",
  "Make워크플로우",
  "ClaudeCode",
  "GPT",
  "Gemini",
  "자동화패키지",
  "홈페이지템플릿",
  "쇼츠제작AI",
] as const;

export type MarketCategory = (typeof categories)[number];

export const sortOptions = [
  { id: "popular", label: "인기순" },
  { id: "latest", label: "최신순" },
  { id: "sales", label: "판매순" },
  { id: "verified", label: "인증상품" },
] as const;
