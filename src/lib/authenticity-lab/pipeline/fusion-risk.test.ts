import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import {
  UarionFusionRisk,
  confidenceWeightedScore,
  multiModalityCorrelationBoost,
  trustTierFromFusion,
} from "./fusion-risk";

describe("UarionFusionRisk", () => {
  const engine = new UarionFusionRisk();
  const policy = loadAuthenticityPolicy();

  it("fuses weighted scores within 0..1", () => {
    const breakdown = engine.fuse({
      policyScore: 0.2,
      hashScore: 0.1,
      malwareScore: 0.1,
      detections: [
        { modality: "image", mockScore: 0.5, labels: [], adapterId: "mock", confidence: 0.8 },
      ],
      keywordHits: ["deepfake"],
      policy,
    });
    expect(breakdown.fused).toBeGreaterThanOrEqual(0);
    expect(breakdown.fused).toBeLessThanOrEqual(1);
    expect(breakdown.keywordBoost).toBeGreaterThan(0);
    expect(breakdown.labelBoost).toBe(0);
    expect(breakdown.correlationBoost).toBe(0);
  });

  it("splits metadataBoost and labelBoost (UARION v3)", () => {
    const breakdown = engine.fuse({
      policyScore: 0.1,
      hashScore: 0.05,
      malwareScore: 0.05,
      detections: [
        {
          modality: "video",
          mockScore: 0.5,
          labels: ["synthetic_signal_mock"],
          adapterId: "mock",
          confidence: 0.8,
        },
      ],
      keywordHits: ["deepfake"],
      metadataSignals: { synthetic: true, impersonation: true },
      policy,
    });
    expect(breakdown.metadataBoost).toBeCloseTo(0.22, 2);
    expect(breakdown.labelBoost).toBeCloseTo(0.06, 2);
    expect(breakdown.fused).toBeGreaterThan(0.35);
  });

  it("confidence weighting lowers effective modality contribution", () => {
    const highConf = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0,
      detections: [
        { modality: "image", mockScore: 0.8, labels: [], adapterId: "mock", confidence: 1 },
      ],
      keywordHits: [],
      policy,
    });
    const lowConf = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0,
      detections: [
        { modality: "image", mockScore: 0.8, labels: [], adapterId: "mock", confidence: 0.2 },
      ],
      keywordHits: [],
      policy,
    });
    expect(highConf.image).toBeGreaterThan(lowConf.image);
    expect(highConf.fused).toBeGreaterThan(lowConf.fused);
  });

  it("multi-modality correlation boost when 2+ high scores", () => {
    const breakdown = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0,
      detections: [
        { modality: "image", mockScore: 0.5, labels: [], adapterId: "mock", confidence: 0.9 },
        { modality: "video", mockScore: 0.6, labels: [], adapterId: "mock", confidence: 0.9 },
      ],
      keywordHits: [],
      policy,
    });
    expect(breakdown.correlationBoost).toBe(0.05);
  });

  it("keyword boost capped by policy", () => {
    const breakdown = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0,
      detections: [],
      keywordHits: ["a", "b", "c", "d", "e", "f"],
      policy,
    });
    expect(breakdown.keywordBoost).toBe(policy.fusion_weights.keyword_boost_cap);
  });

  it("higher malware elevates fusion", () => {
    const low = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0.1,
      detections: [],
      keywordHits: [],
      policy,
    });
    const high = engine.fuse({
      policyScore: 0,
      hashScore: 0,
      malwareScore: 0.9,
      detections: [],
      keywordHits: [],
      policy,
    });
    expect(high.fused).toBeGreaterThan(low.fused);
  });
});

describe("confidenceWeightedScore", () => {
  it("returns mockScore at confidence=1", () => {
    expect(confidenceWeightedScore(0.8, 1)).toBeCloseTo(0.8, 5);
  });

  it("scales down at low confidence", () => {
    expect(confidenceWeightedScore(1, 0)).toBeCloseTo(0.55, 5);
  });
});

describe("multiModalityCorrelationBoost", () => {
  it("returns 0 for single modality", () => {
    expect(
      multiModalityCorrelationBoost([
        { modality: "image", mockScore: 0.9, labels: [], adapterId: "m", confidence: 1 },
      ]),
    ).toBe(0);
  });
});

describe("trustTierFromFusion", () => {
  const t = { pre_block: 0.35, review_required: 0.55, block: 0.78, audit_lock: 0.92 };

  it("maps boundary scores", () => {
    expect(trustTierFromFusion(0, t)).toBe("cleared_mock");
    expect(trustTierFromFusion(0.34, t)).toBe("cleared_mock");
    expect(trustTierFromFusion(0.35, t)).toBe("caution");
    expect(trustTierFromFusion(0.55, t)).toBe("review");
    expect(trustTierFromFusion(0.78, t)).toBe("restricted");
    expect(trustTierFromFusion(0.92, t)).toBe("restricted");
  });
});
