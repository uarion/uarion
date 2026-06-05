import type { MockFileDescriptor } from "../types";
import type { AuthenticityPolicy } from "../policy/types";
import type { HashCheckAdapter } from "./interfaces";

/**
 * CSAM pre-block branch — 구조·주석만. 실제 해시 목록 금지.
 *
 * - 운영 policy `blocked_hashes`는 항상 [] (loader가 비-MOCK 해시 제거)
 * - 테스트는 csam_branch 시나리오에서만 MOCK_BLOCKED_HASH_* 주입
 * - 매칭 시 SOURCE_DELETED 경로로 분기 (mock)
 */
export class MockHashCheck implements HashCheckAdapter {
  async check(file: MockFileDescriptor, policy: AuthenticityPolicy) {
    const start = Date.now();
    const blockedSet = new Set(policy.blocked_hashes);
    const matched = blockedSet.has(file.mockHash);

    if (matched) {
      return {
        step: {
          stepId: "hash_check" as const,
          label: "Hash Check (CSAM branch mock)",
          passed: false,
          score: 1,
          message: "Mock hash matched blocked list — CSAM pre-block branch triggered",
          evidenceId: `ev_hash_block_${file.mockId}`,
          durationMs: Date.now() - start,
        },
        matched: true,
        hashScore: 1,
        csamBranchTriggered: true,
      };
    }

    const suspiciousPrefix = file.mockHash.startsWith("MOCK_SUSPICIOUS_");
    const hashScore = suspiciousPrefix ? 0.55 : 0.05;

    return {
      step: {
        stepId: "hash_check" as const,
        label: "Hash Check (mock)",
        passed: !suspiciousPrefix,
        score: hashScore,
        message: suspiciousPrefix
          ? "Suspicious mock hash prefix — elevated for fusion"
          : "No blocked hash match",
        evidenceId: `ev_hash_${file.mockId}`,
        durationMs: Date.now() - start,
      },
      matched: false,
      hashScore,
      csamBranchTriggered: false,
    };
  }
}
