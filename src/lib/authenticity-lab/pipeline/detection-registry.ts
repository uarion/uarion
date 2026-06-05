import type { DetectionEngineAdapter } from "./interfaces";
import { createDefaultDetectionAdapters, MockDetectionAdapter } from "./detection-engine";
import type { Modality } from "../types";

export type DetectionAdapterKind = "mock" | "stub_external";

/**
 * Stub for future real model adapters — same interface, no external calls.
 * Returns elevated uncertainty score to force Human Review path in mock Lab.
 */
class StubExternalDetectionAdapter extends MockDetectionAdapter {
  constructor(modality: Modality) {
    super(modality, `uarion-stub-external-${modality}-v0`);
  }

  async analyze(file: import("../types").MockFileDescriptor) {
    const base = await super.analyze(file);
    return {
      ...base,
      adapterId: this.adapterId,
      labels: [...base.labels, "external_adapter_not_configured"],
      mockScore: Math.min(1, base.mockScore + 0.08),
      confidence: base.confidence * 0.85,
    };
  }
}

export function createDetectionAdapters(
  kind: DetectionAdapterKind = "mock",
): DetectionEngineAdapter[] {
  if (kind === "stub_external") {
    return (["image", "video", "voice"] as Modality[]).map(
      (m) => new StubExternalDetectionAdapter(m),
    );
  }
  return createDefaultDetectionAdapters();
}

export const DETECTION_ADAPTER_KINDS: DetectionAdapterKind[] = ["mock", "stub_external"];
