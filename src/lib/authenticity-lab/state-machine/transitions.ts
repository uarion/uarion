import type { InspectionStatus } from "../types";

export type TransitionEvent =
  | "SUBMIT"
  | "POLICY_FAIL"
  | "HASH_MATCH"
  | "MALWARE_DETECTED"
  | "FUSION_PRE_BLOCK"
  | "FUSION_REVIEW"
  | "FUSION_BLOCK"
  | "FUSION_AUDIT_LOCK"
  | "FUSION_SAFE"
  | "HUMAN_APPROVE"
  | "HUMAN_REJECT"
  | "HUMAN_ESCALATE"
  | "SOURCE_DELETE"
  | "AUDIT_LOCK";

type TransitionRule = {
  from: InspectionStatus;
  event: TransitionEvent;
  to: InspectionStatus;
};

/** UARION Authenticity state machine — explicit transition table */
export const TRANSITION_RULES: TransitionRule[] = [
  { from: "PENDING", event: "SUBMIT", to: "PENDING" },
  { from: "PENDING", event: "POLICY_FAIL", to: "PRE_BLOCKED" },
  { from: "PENDING", event: "HASH_MATCH", to: "MALWARE_BLOCKED" },
  { from: "PENDING", event: "MALWARE_DETECTED", to: "MALWARE_BLOCKED" },
  { from: "PENDING", event: "FUSION_PRE_BLOCK", to: "PRE_BLOCKED" },
  { from: "PENDING", event: "FUSION_REVIEW", to: "REVIEW_REQUIRED" },
  { from: "PENDING", event: "FUSION_BLOCK", to: "BLOCKED" },
  { from: "PENDING", event: "FUSION_AUDIT_LOCK", to: "AUDIT_LOCKED" },
  { from: "PENDING", event: "FUSION_SAFE", to: "SAFE" },
  { from: "PRE_BLOCKED", event: "SOURCE_DELETE", to: "SOURCE_DELETED" },
  { from: "MALWARE_BLOCKED", event: "SOURCE_DELETE", to: "SOURCE_DELETED" },
  { from: "MALWARE_BLOCKED", event: "AUDIT_LOCK", to: "AUDIT_LOCKED" },
  { from: "REVIEW_REQUIRED", event: "HUMAN_APPROVE", to: "SAFE" },
  { from: "REVIEW_REQUIRED", event: "HUMAN_REJECT", to: "BLOCKED" },
  { from: "REVIEW_REQUIRED", event: "HUMAN_ESCALATE", to: "AUDIT_LOCKED" },
  { from: "BLOCKED", event: "SOURCE_DELETE", to: "SOURCE_DELETED" },
  { from: "BLOCKED", event: "AUDIT_LOCK", to: "AUDIT_LOCKED" },
  { from: "SAFE", event: "AUDIT_LOCK", to: "AUDIT_LOCKED" },
];

export function transition(
  current: InspectionStatus,
  event: TransitionEvent,
): InspectionStatus | null {
  const rule = TRANSITION_RULES.find((r) => r.from === current && r.event === event);
  return rule?.to ?? null;
}

export function applyTransition(
  current: InspectionStatus,
  event: TransitionEvent,
): InspectionStatus {
  const next = transition(current, event);
  if (!next) {
    throw new Error(`Invalid transition: ${current} + ${event}`);
  }
  return next;
}

export function fusionEventForScore(
  score: number,
  thresholds: { pre_block: number; review_required: number; block: number; audit_lock: number },
): TransitionEvent {
  if (score >= thresholds.audit_lock) return "FUSION_AUDIT_LOCK";
  if (score >= thresholds.block) return "FUSION_BLOCK";
  if (score >= thresholds.review_required) return "FUSION_REVIEW";
  if (score >= thresholds.pre_block) return "FUSION_PRE_BLOCK";
  return "FUSION_SAFE";
}
