import { describe, expect, it } from "vitest";
import { scanExpressionViolations, sanitizeLabText } from "./expression-guard";

describe("expression guard", () => {
  it("flags forbidden legal/certainty claims (Korean)", () => {
    const v = scanExpressionViolations("이 결과는 100% 가짜이며 법적 증거입니다");
    expect(v.length).toBeGreaterThan(0);
  });

  it("flags English forbidden patterns", () => {
    expect(scanExpressionViolations("definitively fake with legal evidence")).not.toHaveLength(0);
    expect(scanExpressionViolations("100% authentic")).not.toHaveLength(0);
  });

  it("passes safe mock wording", () => {
    expect(scanExpressionViolations("mock 점수 기준 검토 권고")).toHaveLength(0);
  });

  it("sanitizes risky phrases", () => {
    const out = sanitizeLabText("100% 확정 법적 증거");
    expect(out).not.toMatch(/100\s*%/);
    expect(out).toContain("모의 점수");
  });
});
