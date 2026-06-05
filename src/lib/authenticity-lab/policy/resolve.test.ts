import { describe, expect, it } from "vitest";
import { resolveInspectionPolicy, sanitizeTestBlockedHashes } from "./resolve";

describe("policy resolve", () => {
  it("filters non-mock hashes from test override", () => {
    expect(sanitizeTestBlockedHashes(["MOCK_BLOCKED_HASH_001", "real_hash"])).toEqual([
      "MOCK_BLOCKED_HASH_001",
    ]);
  });

  it("merges only safe test hashes into policy", () => {
    const p = resolveInspectionPolicy({ testBlockedHashes: ["MOCK_BLOCKED_HASH_001"] });
    expect(p.blocked_hashes).toEqual(["MOCK_BLOCKED_HASH_001"]);
  });

  it("returns base policy when override empty", () => {
    const base = resolveInspectionPolicy();
    const empty = resolveInspectionPolicy({ testBlockedHashes: [] });
    expect(empty.blocked_hashes).toEqual(base.blocked_hashes);
  });

  it("does not mutate fusion weights", () => {
    const p = resolveInspectionPolicy({ testBlockedHashes: ["MOCK_BLOCKED_HASH_001"] });
    expect(p.fusion_weights.policy).toBeGreaterThan(0);
    expect(p.version).toBeTruthy();
  });
});
