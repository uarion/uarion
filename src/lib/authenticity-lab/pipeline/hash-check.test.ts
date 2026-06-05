import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import { MOCK_CSAM_HASH, MOCK_SAFE_IMAGE } from "../mock/fixtures";
import { MockHashCheck } from "./hash-check";

describe("MockHashCheck CSAM branch structure", () => {
  const checker = new MockHashCheck();
  const basePolicy = loadAuthenticityPolicy();

  it("no match on safe hash", async () => {
    const result = await checker.check(MOCK_SAFE_IMAGE, basePolicy);
    expect(result.matched).toBe(false);
    expect(result.csamBranchTriggered).toBe(false);
  });

  it("triggers CSAM branch when test policy includes mock blocked hash", async () => {
    const testPolicy = {
      ...basePolicy,
      blocked_hashes: ["MOCK_BLOCKED_HASH_001"],
    };
    const result = await checker.check(MOCK_CSAM_HASH, testPolicy);
    expect(result.matched).toBe(true);
    expect(result.csamBranchTriggered).toBe(true);
    expect(result.hashScore).toBe(1);
  });
});
