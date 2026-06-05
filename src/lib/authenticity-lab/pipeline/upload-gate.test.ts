import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE } from "../mock/fixtures";
import { MockUploadGate } from "./upload-gate";

describe("MockUploadGate", () => {
  it("accepts valid mock descriptor", async () => {
    const gate = new MockUploadGate();
    const result = await gate.validate(MOCK_SAFE_IMAGE);
    expect(result.passed).toBe(true);
    expect(result.stepId).toBe("upload_gate");
  });

  it("rejects non-mock id prefix", async () => {
    const gate = new MockUploadGate();
    const result = await gate.validate({
      ...MOCK_SAFE_IMAGE,
      mockId: "real_file_001",
    });
    expect(result.passed).toBe(false);
  });
});
