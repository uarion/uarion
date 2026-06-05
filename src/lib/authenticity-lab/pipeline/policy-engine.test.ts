import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import { MOCK_BLOCKED_EXT, MOCK_SAFE_IMAGE } from "../mock/fixtures";
import { UarionPolicyEngine } from "./policy-engine";

describe("UarionPolicyEngine", () => {
  const engine = new UarionPolicyEngine();
  const policy = loadAuthenticityPolicy();

  it("passes safe mock image", async () => {
    const result = await engine.evaluate(MOCK_SAFE_IMAGE, policy);
    expect(result.step.passed).toBe(true);
    expect(result.policyScore).toBeLessThan(0.35);
  });

  it("blocks dangerous extension", async () => {
    const result = await engine.evaluate(MOCK_BLOCKED_EXT, policy);
    expect(result.step.passed).toBe(false);
    expect(result.violations.some((v) => v.code === "EXTENSION_BLOCKED")).toBe(true);
  });
});
