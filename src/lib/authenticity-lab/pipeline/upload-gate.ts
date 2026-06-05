import type { MockFileDescriptor, StepResult } from "../types";
import type { UploadGateAdapter } from "./interfaces";

/** Mock upload gate — rejects real-file semantics; validates mock descriptor only */
export class MockUploadGate implements UploadGateAdapter {
  async validate(file: MockFileDescriptor): Promise<StepResult> {
    const start = Date.now();
    const hasMockId = file.mockId.startsWith("mock_");
    const validSize = file.sizeBytes > 0 && file.sizeBytes < 500_000_000;

    if (!hasMockId || !validSize || !file.fileName) {
      return {
        stepId: "upload_gate" as const,
        label: "Upload Gate (mock)",
        passed: false,
        message: "Mock descriptor invalid — real uploads are not supported",
        durationMs: Date.now() - start,
      };
    }

    return {
      stepId: "upload_gate" as const,
      label: "Upload Gate (mock)",
      passed: true,
      score: 0,
      message: `Mock descriptor accepted: ${file.mockId}`,
      evidenceId: `ev_upload_${file.mockId}`,
      durationMs: Date.now() - start,
    };
  }
}
