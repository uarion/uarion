import { describe, expect, it } from "vitest";
import { applyTransition, fusionEventForScore, transition, TRANSITION_RULES } from "./transitions";

describe("state machine transitions", () => {
  it("PENDING + FUSION_SAFE → SAFE", () => {
    expect(transition("PENDING", "FUSION_SAFE")).toBe("SAFE");
  });

  it("REVIEW_REQUIRED + HUMAN_REJECT → BLOCKED", () => {
    expect(applyTransition("REVIEW_REQUIRED", "HUMAN_REJECT")).toBe("BLOCKED");
  });

  it("invalid transition returns null", () => {
    expect(transition("SAFE", "HASH_MATCH")).toBeNull();
  });

  it("applyTransition throws on invalid", () => {
    expect(() => applyTransition("SAFE", "HASH_MATCH")).toThrow(/Invalid transition/);
  });

  it("all rules have valid from/to statuses", () => {
    for (const r of TRANSITION_RULES) {
      expect(r.from).toBeTruthy();
      expect(r.to).toBeTruthy();
      expect(r.event).toBeTruthy();
    }
  });

  it("fusionEventForScore respects thresholds (inclusive)", () => {
    const t = { pre_block: 0.35, review_required: 0.55, block: 0.78, audit_lock: 0.92 };
    expect(fusionEventForScore(0.1, t)).toBe("FUSION_SAFE");
    expect(fusionEventForScore(0.35, t)).toBe("FUSION_PRE_BLOCK");
    expect(fusionEventForScore(0.55, t)).toBe("FUSION_REVIEW");
    expect(fusionEventForScore(0.78, t)).toBe("FUSION_BLOCK");
    expect(fusionEventForScore(0.92, t)).toBe("FUSION_AUDIT_LOCK");
    expect(fusionEventForScore(0.95, t)).toBe("FUSION_AUDIT_LOCK");
  });

  it("SOURCE_DELETED reachable from PRE_BLOCKED", () => {
    expect(applyTransition("PRE_BLOCKED", "SOURCE_DELETE")).toBe("SOURCE_DELETED");
  });
});
