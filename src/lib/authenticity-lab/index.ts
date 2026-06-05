export * from "./types";
export { loadAuthenticityPolicy, resetPolicyCache } from "./policy/loader";
export { resolveInspectionPolicy, sanitizeTestBlockedHashes } from "./policy/resolve";
export type { AuthenticityPolicy, FusionWeights, RiskThresholds } from "./policy/types";
export { transition, applyTransition, fusionEventForScore, TRANSITION_RULES } from "./state-machine/transitions";
export { LAB_DISCLAIMER, scanExpressionViolations, sanitizeLabText } from "./expression-guard";
export { runMockInspection } from "./pipeline/orchestrator";
export {
  UarionFusionRisk,
  trustTierFromFusion,
  confidenceWeightedScore,
  multiModalityCorrelationBoost,
} from "./pipeline/fusion-risk";
export { deriveTrustSignals } from "./trust-flow";
export type { TrustSignal, TrustSurface } from "./trust-flow";
export { createDetectionAdapters, DETECTION_ADAPTER_KINDS } from "./pipeline/detection-registry";
export type { DetectionAdapterKind } from "./pipeline/detection-registry";
export { parseMockFileDescriptor } from "./mock/validate-descriptor";
export * from "./mock/fixtures";
