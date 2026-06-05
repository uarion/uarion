import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import {
  resolveCsamTestHashes,
  resolveDetectionAdapterKind,
  stripNonMockBlockedHashes,
} from "./runtime-guard";

describe("runtime-guard", () => {
  it("allows mock and stub_external adapters", () => {
    expect(resolveDetectionAdapterKind("mock")).toEqual({ kind: "mock" });
    expect(resolveDetectionAdapterKind("stub_external")).toEqual({ kind: "stub_external" });
  });

  it("rejects real/live detection modes", () => {
    expect(resolveDetectionAdapterKind("real")).toHaveProperty("error");
    expect(resolveDetectionAdapterKind("production")).toHaveProperty("error");
  });

  it("rejects unknown adapter kinds", () => {
    expect(resolveDetectionAdapterKind("unknown_xyz")).toHaveProperty("error");
  });

  it("CSAM test hashes only for csam_branch scenario", () => {
    expect(resolveCsamTestHashes(["MOCK_BLOCKED_HASH_001"], "safe_image")).toEqual([]);
    expect(resolveCsamTestHashes(["MOCK_BLOCKED_HASH_001"], "csam_branch")).toEqual([
      "MOCK_BLOCKED_HASH_001",
    ]);
    expect(resolveCsamTestHashes(undefined, "csam_branch")).toEqual(["MOCK_BLOCKED_HASH_001"]);
  });

  it("strips non-mock hashes from policy", () => {
    const base = loadAuthenticityPolicy();
    const tainted = { ...base, blocked_hashes: ["real_hash_abc", "MOCK_BLOCKED_HASH_002"] };
    const clean = stripNonMockBlockedHashes(tainted);
    expect(clean.blocked_hashes).toEqual(["MOCK_BLOCKED_HASH_002"]);
  });
});
