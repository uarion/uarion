import { describe, expect, it } from "vitest";
import { applyTransition, fusionEventForScore, transition } from "./transitions";

describe("state machine transitions", () => {
  it("PENDING + FUSION_SAFE → SAFE", () => {
    expect(transition("PENDING", "FUSION_SAFE")).toBe("SAFE");
  });

  it("REVIEW_REQUIRED + HUMAN_REJECT → BLOCKED", () => {
    expect(applyTransition("REVIEW_REQUIRED", "HUMAN_REJECT")).toBe("BLOCKED");
  });

  it("fusionEventForScore respects thresholds", () => {
    const t = { pre_block: 0.35, review_required: 0.55, block: 0.78, audit_lock: 0.92 };
    expect(fusionEventForScore(0.1, t)).toBe("FUSION_SAFE");
    expect(fusionEventForScore(0.4, t)).toBe("FUSION_PRE_BLOCK");
    expect(fusionEventForScore(0.6, t)).toBe("FUSION_REVIEW");
    expect(fusionEventForScore(0.8, t)).toBe("FUSION_BLOCK");
    expect(fusionEventForScore(0.95, t)).toBe("FUSION_AUDIT_LOCK");
  });
});
