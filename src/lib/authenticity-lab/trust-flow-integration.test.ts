import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE } from "./mock/fixtures";
import { runMockInspection } from "./pipeline/orchestrator";
import { deriveProductTrustActions } from "./trust-flow-integration";

describe("deriveProductTrustActions", () => {
  it("maps safe mock to allow_mock_listing on market", async () => {
    const report = await runMockInspection({ file: MOCK_SAFE_IMAGE });
    const actions = deriveProductTrustActions(report);
    const market = actions.find((a) => a.surface === "market");
    expect(market?.action).toBe("allow_mock_listing");
    expect(market?.isMock).toBe(true);
  });

  it("returns 3 surface actions", async () => {
    const report = await runMockInspection({ file: MOCK_SAFE_IMAGE });
    expect(deriveProductTrustActions(report)).toHaveLength(3);
  });
});
