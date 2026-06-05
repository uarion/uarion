import type { DetectionResult, MockFileDescriptor, Modality } from "../types";
import type { DetectionEngineAdapter } from "./interfaces";

function modalityFromMime(mime: string): Modality | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "voice";
  return null;
}

/** Pluggable mock detection adapter — swap real models behind same interface */
export class MockDetectionAdapter implements DetectionEngineAdapter {
  constructor(
    readonly modality: Modality,
    readonly adapterId: string,
  ) {}

  async analyze(file: MockFileDescriptor): Promise<DetectionResult> {
    const inferred = modalityFromMime(file.mimeType);
    const meta = file.metadata ?? {};
    const syntheticFlag = meta.synthetic === "true" || file.mockHash.includes("SYNTH");
    const impersonationFlag = meta.impersonation === "true";

    let mockScore = 0.12;
    const labels: string[] = ["mock_baseline"];

    if (syntheticFlag) {
      mockScore += 0.45;
      labels.push("synthetic_signal_mock");
    }
    if (impersonationFlag) {
      mockScore += 0.35;
      labels.push("impersonation_signal_mock");
    }
    if (file.mockHash.startsWith(`MOCK_${this.modality.toUpperCase()}_HIGH`)) {
      mockScore = 0.82;
      labels.push("high_risk_mock");
    }

    if (inferred && inferred !== this.modality) {
      mockScore = Math.max(mockScore, 0.25);
      labels.push("modality_mismatch_mock");
    }

    mockScore = Math.min(1, mockScore);

    return {
      modality: this.modality,
      mockScore,
      labels,
      adapterId: this.adapterId,
      confidence: 0.7 + mockScore * 0.25,
    };
  }
}

export function createDefaultDetectionAdapters(): DetectionEngineAdapter[] {
  return [
    new MockDetectionAdapter("image", "uarion-mock-image-v1"),
    new MockDetectionAdapter("video", "uarion-mock-video-v1"),
    new MockDetectionAdapter("voice", "uarion-mock-voice-v1"),
  ];
}
