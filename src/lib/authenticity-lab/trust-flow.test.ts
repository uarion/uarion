import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE } from "./mock/fixtures";
import { runMockInspection } from "./pipeline/orchestrator";
import { deriveTrustSignals } from "./trust-flow";

describe("deriveTrustSignals", () => {
  it("maps safe mock to cleared_mock on all surfaces", async () => {
    const report = await runMockInspection({ file: MOCK_SAFE_IMAGE });
    const signals = deriveTrustSignals(report);
    expect(signals).toHaveLength(3);
    expect(signals.map((s) => s.surface)).toEqual(["market", "registry", "certification"]);
    expect(signals.every((s) => s.message.includes("mock"))).toBe(true);
  });
});
