import { DETECTION_ADAPTER_KINDS, type DetectionAdapterKind } from "../pipeline/detection-registry";
import { sanitizeTestBlockedHashes } from "../policy/resolve";
import type { AuthenticityPolicy } from "../policy/types";

/** Lab는 항상 mock-only. 실제 탐지/파일은 명시 플래그 없이 불가. */
export const LAB_RUNTIME_MODE = "mock_only" as const;

const MOCK_HASH_PREFIX = "MOCK_BLOCKED_HASH_";
const CSAM_TEST_SCENARIO_ID = "csam_branch";

/**
 * 실제 어댑터 종류 차단. mock / stub_external 만 허용.
 * ALLOW_REAL_LAB_MODE=true 가 없으면 "real"|"live"|"production" 등 거부.
 */
export function resolveDetectionAdapterKind(
  input: string | undefined,
): { kind: DetectionAdapterKind } | { error: string } {
  const raw = (input ?? "mock").trim().toLowerCase();

  if (raw === "real" || raw === "live" || raw === "production" || raw === "external") {
    if (process.env.ALLOW_REAL_LAB_MODE === "true") {
      return { error: "Real detection adapters are not implemented. ALLOW_REAL_LAB_MODE is ignored." };
    }
    return { error: "Real detection mode is disabled. Use mock or stub_external." };
  }

  if (!DETECTION_ADAPTER_KINDS.includes(raw as DetectionAdapterKind)) {
    return { error: `Invalid detectionAdapterKind: ${input}` };
  }

  return { kind: raw as DetectionAdapterKind };
}

/**
 * CSAM 테스트 해시는 csam_branch 시나리오에서만 주입 가능.
 * 운영 policy 파일의 blocked_hashes는 항상 비어 있어야 함.
 */
export function resolveCsamTestHashes(
  hashes: string[] | undefined,
  scenarioId: string | undefined,
): string[] {
  const safe = sanitizeTestBlockedHashes(hashes);
  if (scenarioId !== CSAM_TEST_SCENARIO_ID) {
    return [];
  }
  if (safe.length > 0) return safe;
  return [`${MOCK_HASH_PREFIX}001`];
}

/** policy JSON에 실제 해시가 들어온 경우 런타임에서 제거 (방어적) */
export function stripNonMockBlockedHashes(policy: AuthenticityPolicy): AuthenticityPolicy {
  const blocked_hashes = policy.blocked_hashes.filter((h) => h.startsWith(MOCK_HASH_PREFIX));
  if (blocked_hashes.length === policy.blocked_hashes.length) return policy;
  return { ...policy, blocked_hashes };
}

export function assertMockOnlyInspection(file: { mockId: string }): void {
  if (!file.mockId.startsWith("mock_")) {
    throw new Error("Mock-only pipeline: mockId must start with mock_");
  }
}
