import policyJson from "../../../../policy/authenticity-policy.json";
import { stripNonMockBlockedHashes } from "../safety/runtime-guard";
import type { AuthenticityPolicy } from "./types";

let cached: AuthenticityPolicy | null = null;

export function loadAuthenticityPolicy(): AuthenticityPolicy {
  if (cached) return cached;
  cached = stripNonMockBlockedHashes(policyJson as AuthenticityPolicy);
  return cached;
}

export function resetPolicyCache(): void {
  cached = null;
}
