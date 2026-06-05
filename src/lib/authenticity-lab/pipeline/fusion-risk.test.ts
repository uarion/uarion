import { describe, expect, it } from "vitest";
import { loadAuthenticityPolicy } from "../policy/loader";
import { UarionFusionRisk } from "./fusion-risk";

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
    expect(breakdown.metadataBoost).toBeGreaterThanOrEqual(0);
  });

  it("metadata signals elevate fusion (UARION proprietary)", () => {
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
    expect(breakdown.metadataBoost).toBeGreaterThan(0.2);
    expect(breakdown.fused).toBeGreaterThan(0.35);
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
