import { loadAuthenticityPolicy } from "./loader";
import type { AuthenticityPolicy } from "./types";

const MOCK_HASH_PREFIX = "MOCK_BLOCKED_HASH_";

/** 테스트 전용 — MOCK_BLOCKED_HASH_* 만 policy에 병합 (운영 해시 금지) */
export function sanitizeTestBlockedHashes(hashes: string[] | undefined): string[] {
  if (!hashes?.length) return [];
  return hashes.filter((h) => h.startsWith(MOCK_HASH_PREFIX));
}

export function resolveInspectionPolicy(options?: {
  testBlockedHashes?: string[];
}): AuthenticityPolicy {
  const base = loadAuthenticityPolicy();
  const safe = sanitizeTestBlockedHashes(options?.testBlockedHashes);
  if (!safe.length) return base;
  return { ...base, blocked_hashes: safe };
}
