import policyJson from "../../../../policy/authenticity-policy.json";
import type { AuthenticityPolicy } from "./types";

let cached: AuthenticityPolicy | null = null;

export function loadAuthenticityPolicy(): AuthenticityPolicy {
  if (cached) return cached;
  cached = policyJson as AuthenticityPolicy;
  return cached;
}

export function resetPolicyCache(): void {
  cached = null;
}
