import type { Modality } from "../types";
import type { AuthenticityPolicy } from "../policy/types";
import type { HumanReviewAdapter } from "./interfaces";

export class MockHumanReview implements HumanReviewAdapter {
  async review(input: {
    fusionScore: number;
    modalities: Modality[];
    policy: AuthenticityPolicy;
  }) {
    const start = Date.now();
    const rules = input.policy.review_rules;

    const voiceRequiresReview = input.modalities.includes("voice") &&
      rules.always_review_modalities.includes("voice");

    const needsReview =
      voiceRequiresReview ||
      input.fusionScore >= rules.auto_escalate_fusion_above ||
      input.fusionScore > rules.max_auto_safe_fusion;

    let decision: import("../types").HumanReviewDecision = "pending";
    let message = "Queued for mock human review";

    if (!needsReview && input.fusionScore <= rules.max_auto_safe_fusion) {
      decision = "approve_mock";
      message = "Auto-cleared mock (below review threshold)";
    } else if (input.fusionScore >= rules.require_dual_reviewer_above) {
      decision = "escalate_mock";
      message = "Dual-reviewer mock escalation required";
    } else if (input.fusionScore >= input.policy.risk_threshold.block) {
      decision = "reject_mock";
      message = "Mock reviewer reject recommendation";
    }

    return {
      step: {
        stepId: "human_review" as const,
        label: "Human Review (mock)",
        passed: decision === "approve_mock",
        score: input.fusionScore,
        message,
        evidenceId: `ev_review_${Date.now()}`,
        durationMs: Date.now() - start,
      },
      decision,
    };
  }
}
