import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import { MockHumanReview } from "./human-review";

describe("MockHumanReview", () => {
  const policy = loadAuthenticityPolicy();
  const review = new MockHumanReview();

  it("auto-approves very low fusion", async () => {
    const r = await review.review({ fusionScore: 0.1, modalities: ["image"], policy });
    expect(r.decision).toBe("approve_mock");
    expect(r.step.passed).toBe(true);
  });

  it("queues voice modality always", async () => {
    const r = await review.review({ fusionScore: 0.1, modalities: ["voice"], policy });
    expect(["pending", "escalate_mock"]).toContain(r.decision);
    expect(r.step.passed).toBe(false);
  });

  it("escalates at dual-reviewer threshold", async () => {
    const r = await review.review({
      fusionScore: policy.review_rules.require_dual_reviewer_above,
      modalities: ["image"],
      policy,
    });
    expect(r.decision).toBe("escalate_mock");
  });

  it("rejects at block threshold", async () => {
    const r = await review.review({
      fusionScore: policy.risk_threshold.block,
      modalities: ["image"],
      policy,
    });
    expect(r.decision).toBe("reject_mock");
  });
});
