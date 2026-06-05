import type { DetectionResult, FusionBreakdown } from "../types";
import type { AuthenticityPolicy } from "../policy/types";
import type { FusionRiskEngine, MetadataSignals } from "./interfaces";

const HIGH_RISK_LABELS = new Set([
  "synthetic_signal_mock",
  "impersonation_signal_mock",
  "high_risk_mock",
]);

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

/**
 * UARION FusionRisk — proprietary weighted fusion.
 * Combines policy, hash, malware, modality scores, keyword hits, and metadata signals.
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

    const image = input.detections.find((d) => d.modality === "image")?.mockScore ?? 0;
    const video = input.detections.find((d) => d.modality === "video")?.mockScore ?? 0;
    const voice = input.detections.find((d) => d.modality === "voice")?.mockScore ?? 0;

    const keywordBoost = Math.min(
      w.keyword_boost_cap,
      input.keywordHits.length * 0.05,
    );

    const metadataBoost = computeMetadataBoost(input.metadataSignals);
    const labelBoost = detectionLabelBoost(input.detections);

    const raw =
      input.policyScore * w.policy +
      input.hashScore * w.hash +
      input.malwareScore * w.malware +
      image * w.image_detection +
      video * w.video_detection +
      voice * w.voice_detection +
      keywordBoost +
      metadataBoost +
      labelBoost;

    const fused = Math.min(1, Math.max(0, raw));

    return {
      policy: input.policyScore,
      hash: input.hashScore,
      malware: input.malwareScore,
      image,
      video,
      voice,
      keywordBoost,
      metadataBoost: metadataBoost + labelBoost,
      raw,
      fused,
    };
  }
}

export function trustTierFromFusion(fused: number, thresholds: AuthenticityPolicy["risk_threshold"]) {
  if (fused >= thresholds.audit_lock) return "restricted" as const;
  if (fused >= thresholds.block) return "restricted" as const;
  if (fused >= thresholds.review_required) return "review" as const;
  if (fused >= thresholds.pre_block) return "caution" as const;
  return "cleared_mock" as const;
}
