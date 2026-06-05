import { describe, expect, it } from "vitest";
import {
  MOCK_BLOCKED_EXT,
  MOCK_MALWARE,
  MOCK_SAFE_IMAGE,
  MOCK_SYNTHETIC_VIDEO,
  MOCK_VOICE_REVIEW,
} from "../mock/fixtures";
import { runMockInspection } from "./orchestrator";

describe("runMockInspection integration (mock-only)", () => {
  it("safe image → SAFE or low-risk path", async () => {
    const report = await runMockInspection({ file: MOCK_SAFE_IMAGE });
    expect(report.isMock).toBe(true);
    expect(report.steps.length).toBeGreaterThanOrEqual(8);
    expect(["SAFE", "REVIEW_REQUIRED", "PRE_BLOCKED"]).toContain(report.status);
    expect(report.disclaimer).toContain("MOCKUP");
  });

  it("blocked extension → PRE_BLOCKED or SOURCE_DELETED", async () => {
    const report = await runMockInspection({ file: MOCK_BLOCKED_EXT });
    expect(["PRE_BLOCKED", "SOURCE_DELETED"]).toContain(report.status);
  });

  it("malware mock → SOURCE_DELETED path", async () => {
    const report = await runMockInspection({ file: MOCK_MALWARE });
    expect(report.status).toBe("SOURCE_DELETED");
    expect(report.steps.some((s) => s.stepId === "malware_scan" && !s.passed)).toBe(true);
  });

  it("synthetic video elevates fusion", async () => {
    const report = await runMockInspection({ file: MOCK_SYNTHETIC_VIDEO });
    expect(report.fusionScore).toBeGreaterThan(0.35);
    expect(report.steps.some((s) => s.stepId === "fusion_risk")).toBe(true);
  });

  it("voice modality triggers review-related flow", async () => {
    const report = await runMockInspection({ file: MOCK_VOICE_REVIEW });
    expect(report.steps.some((s) => s.stepId === "detection_voice")).toBe(true);
    expect(report.steps.some((s) => s.stepId === "human_review")).toBe(true);
  });

  it("never processes real files — mockId required", async () => {
    const report = await runMockInspection({
      file: {
        mockId: "not_mock_prefix",
        fileName: "x.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 100,
        mockHash: "x",
      },
    });
    expect(report.steps[0].passed).toBe(false);
  });
});
