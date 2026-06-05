import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE, MOCK_SYNTHETIC_VIDEO } from "./mock/fixtures";
import { runMockInspection } from "./pipeline/orchestrator";
import { deriveTrustSignals } from "./trust-flow";
import type { InspectionReport } from "./types";

function mockReport(overrides: Partial<InspectionReport>): InspectionReport {
  return {
    inspectionId: "insp_test",
    status: "SAFE",
    fusionScore: 0.1,
    fusionBreakdown: {
      policy: 0,
      hash: 0,
      malware: 0,
      image: 0,
      video: 0,
      voice: 0,
      keywordBoost: 0,
      metadataBoost: 0,
      labelBoost: 0,
      correlationBoost: 0,
      raw: 0,
      fused: 0.1,
    },
    steps: [],
    trustTier: "cleared_mock",
    expressionSafe: true,
    expressionViolations: [],
    auditTrail: [],
    createdAt: new Date().toISOString(),
    isMock: true,
    disclaimer: "mock",
    ...overrides,
  };
}

describe("deriveTrustSignals", () => {
  it("maps safe mock to cleared_mock on all surfaces", async () => {
    const report = await runMockInspection({ file: MOCK_SAFE_IMAGE });
    const signals = deriveTrustSignals(report);
    expect(signals).toHaveLength(3);
    expect(signals.map((s) => s.surface)).toEqual(["market", "registry", "certification"]);
    expect(signals.every((s) => s.message.includes("mock"))).toBe(true);
  });

  it("maps BLOCKED status to blocked level", () => {
    const signals = deriveTrustSignals(mockReport({ status: "BLOCKED", trustTier: "restricted" }));
    expect(signals.every((s) => s.level === "blocked")).toBe(true);
  });

  it("maps REVIEW_REQUIRED to review level", () => {
    const signals = deriveTrustSignals(
      mockReport({ status: "REVIEW_REQUIRED", trustTier: "review" }),
    );
    expect(signals.every((s) => s.level === "review")).toBe(true);
  });

  it("maps caution tier for elevated fusion", async () => {
    const report = await runMockInspection({ file: MOCK_SYNTHETIC_VIDEO });
    const signals = deriveTrustSignals(report);
    expect(["caution", "review", "restricted", "blocked"]).toContain(signals[0].level);
  });
});
