/** UARION expression principles — forbidden claims in Lab output */

const FORBIDDEN_PATTERNS: RegExp[] = [
  /불법/i,
  /가짜\s*확정/i,
  /범죄\s*입증/i,
  /100\s*%/i,
  /법적\s*증거/i,
  /illegal/i,
  /criminal\s*proof/i,
  /legal\s*evidence/i,
  /100%\s*(fake|real|authentic)/i,
  /definitively\s*fake/i,
];

export function scanExpressionViolations(text: string): string[] {
  const violations: string[] = [];
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(pattern.source);
    }
  }
  return violations;
}

export function sanitizeLabText(text: string): string {
  return text
    .replace(/100\s*%/gi, "모의 점수 기준")
    .replace(/법적\s*증거/gi, "내부 감사 기록")
    .replace(/legal\s*evidence/gi, "internal audit record");
}

export const LAB_DISCLAIMER =
  "STATIC MOCKUP — 실제 검사가 아닙니다. 모든 입력·탐지·점수는 mock이며 법적 효력이 없습니다.";
