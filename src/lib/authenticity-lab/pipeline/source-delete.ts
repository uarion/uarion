import type { MockFileDescriptor, StepResult } from "../types";
import type { SourceDeleteAdapter } from "./interfaces";

/** Mock source delete — no real files touched */
export class MockSourceDelete implements SourceDeleteAdapter {
  async deleteSource(file: MockFileDescriptor, reason: string): Promise<StepResult> {
    const start = Date.now();
    return {
      stepId: "source_delete" as const,
      label: "Source Delete (mock)",
      passed: true,
      message: `Mock source marked deleted for ${file.mockId}: ${reason}`,
      evidenceId: `ev_delete_${file.mockId}`,
      durationMs: Date.now() - start,
    };
  }
}
