import { describe, expect, it } from "vitest";
import { validateRunCustomBody, validateRunScenarioBody } from "./api-input";

describe("api-input validation", () => {
  it("rejects unknown scenarioId", () => {
    const r = validateRunScenarioBody({ scenarioId: "evil_scenario" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(400);
  });

  it("accepts known scenario", () => {
    const r = validateRunScenarioBody({ scenarioId: "safe_image" });
    expect(r.ok).toBe(true);
  });

  it("rejects testBlockedHashes on non-csam scenario", () => {
    const r = validateRunScenarioBody({
      scenarioId: "safe_image",
      testBlockedHashes: ["MOCK_BLOCKED_HASH_001"],
    });
    expect(r.ok).toBe(false);
  });

  it("allows testBlockedHashes on csam_branch", () => {
    const r = validateRunScenarioBody({
      scenarioId: "csam_branch",
      testBlockedHashes: ["MOCK_BLOCKED_HASH_001"],
    });
    expect(r.ok).toBe(true);
  });

  it("rejects testBlockedHashes on run-custom", () => {
    const r = validateRunCustomBody({
      mockFile: { mockId: "mock_x" },
      testBlockedHashes: ["MOCK_BLOCKED_HASH_001"],
    });
    expect(r.ok).toBe(false);
  });

  it("rejects real adapter on run-custom", () => {
    const r = validateRunCustomBody({ mockFile: {}, detectionAdapterKind: "real" });
    expect(r.ok).toBe(false);
  });
});
