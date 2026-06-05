import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE, MOCK_SYNTHETIC_VIDEO } from "../mock/fixtures";
import { createDetectionAdapters } from "./detection-registry";

describe("createDetectionAdapters", () => {
  it("mock kind returns 3 default adapters", () => {
    const adapters = createDetectionAdapters("mock");
    expect(adapters).toHaveLength(3);
    expect(adapters.map((a) => a.modality).sort()).toEqual(["image", "video", "voice"]);
  });

  it("stub_external elevates score and adds label", async () => {
    const adapters = createDetectionAdapters("stub_external");
    const video = adapters.find((a) => a.modality === "video")!;
    const mockAdapters = createDetectionAdapters("mock");
    const mockVideo = mockAdapters.find((a) => a.modality === "video")!;

    const stubResult = await video.analyze(MOCK_SYNTHETIC_VIDEO);
    const mockResult = await mockVideo.analyze(MOCK_SYNTHETIC_VIDEO);

    expect(stubResult.mockScore).toBeGreaterThan(mockResult.mockScore);
    expect(stubResult.labels).toContain("external_adapter_not_configured");
    expect(stubResult.adapterId).toContain("stub-external");
  });

  it("stub_external still analyzes safe image", async () => {
    const image = createDetectionAdapters("stub_external").find((a) => a.modality === "image")!;
    const result = await image.analyze(MOCK_SAFE_IMAGE);
    expect(result.mockScore).toBeGreaterThanOrEqual(0);
    expect(result.mockScore).toBeLessThanOrEqual(1);
  });
});
