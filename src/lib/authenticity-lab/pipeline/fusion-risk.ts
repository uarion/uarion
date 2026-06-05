import type { DetectionResult, FusionBreakdown } from "../types";
import type { AuthenticityPolicy, RiskThresholds } from "../policy/types";
import type { FusionRiskEngine, MetadataSignals } from "./interfaces";

const HIGH_RISK_LABELS = new Set([
  "synthetic_signal_mock",
  "impersonation_signal_mock",
  "high_risk_mock",
]);

/** UARION — 탐지 confidence로 모달리티 점수 보정 (0.55~1.0 배율) */
export function confidenceWeightedScore(mockScore: number, confidence: number): number {
  const clamped = Math.min(1, Math.max(0, confidence));
  const weight = 0.55 + 0.45 * clamped;
  return mockScore * weight;
}

function computeMetadataBoost(signals: MetadataSignals | undefined): number {
  if (!signals) return 0;
  let boost = 0;
  if (signals.synthetic) boost += 0.14;
  if (signals.impersonation) boost += 0.12;
  return Math.min(0.22, boost);
}

function detectionLabelBoost(detections: DetectionResult[]): number {
  let boost = 0;
  for (const d of detections) {
    if (d.labels.some((l) => HIGH_RISK_LABELS.has(l))) {
      boost += 0.06;
    }
  }
  return Math.min(0.12, boost);
}

/** 2개 이상 모달리티가 고위험(≥0.4)이면 상관 부스트 */
export function multiModalityCorrelationBoost(detections: DetectionResult[]): number {
  const highCount = detections.filter((d) => d.mockScore >= 0.4).length;
  return highCount >= 2 ? 0.05 : 0;
}

function weightedModalityScores(detections: DetectionResult[]): {
  image: number;
  video: number;
  voice: number;
} {
  const scores = { image: 0, video: 0, voice: 0 };
  for (const d of detections) {
    scores[d.modality] = confidenceWeightedScore(d.mockScore, d.confidence);
  }
  return scores;
}

/**
 * UARION FusionRisk v3 — proprietary weighted fusion.
 * Policy, hash, malware, confidence-weighted modality scores, keywords, metadata, labels, correlation.
 */
export class UarionFusionRisk implements FusionRiskEngine {
  fuse(input: {
    policyScore: number;
    hashScore: number;
    malwareScore: number;
    detections: DetectionResult[];
    keywordHits: string[];
    metadataSignals?: MetadataSignals;
    policy: AuthenticityPolicy;
  }): FusionBreakdown {
    const w = input.policy.fusion_weights;
    const { image, video, voice } = weightedModalityScores(input.detections);

    const keywordBoost = Math.min(w.keyword_boost_cap, input.keywordHits.length * 0.05);

    const metadataBoost = computeMetadataBoost(input.metadataSignals);
    const labelBoost = detectionLabelBoost(input.detections);
    const correlationBoost = multiModalityCorrelationBoost(input.detections);

    const raw =
      input.policyScore * w.policy +
      input.hashScore * w.hash +
      input.malwareScore * w.malware +
      image * w.image_detection +
      video * w.video_detection +
      voice * w.voice_detection +
      keywordBoost +
      metadataBoost +
      labelBoost +
      correlationBoost;

    const fused = Math.min(1, Math.max(0, raw));

    return {
      policy: input.policyScore,
      hash: input.hashScore,
      malware: input.malwareScore,
      image,
      video,
      voice,
      keywordBoost,
      metadataBoost,
      labelBoost,
      correlationBoost,
      raw,
      fused,
    };
  }
}

export type TrustTier = import("../types").TrustTier;

export function trustTierFromFusion(fused: number, thresholds: RiskThresholds): TrustTier {
  if (fused >= thresholds.audit_lock) return "restricted";
  if (fused >= thresholds.block) return "restricted";
  if (fused >= thresholds.review_required) return "review";
  if (fused >= thresholds.pre_block) return "caution";
  return "cleared_mock";
}
