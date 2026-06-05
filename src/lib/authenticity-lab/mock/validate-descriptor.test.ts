import { describe, expect, it } from "vitest";
import { MOCK_SAFE_IMAGE } from "./fixtures";
import { parseMockFileDescriptor } from "./validate-descriptor";

describe("parseMockFileDescriptor", () => {
  it("accepts valid fixture shape", () => {
    const r = parseMockFileDescriptor(MOCK_SAFE_IMAGE);
    expect(r.error).toBeNull();
    expect(r.file?.mockId).toBe("mock_safe_image_001");
  });

  it("rejects non-mock id", () => {
    const r = parseMockFileDescriptor({ ...MOCK_SAFE_IMAGE, mockId: "real_1" });
    expect(r.file).toBeNull();
    expect(r.error).toBeTruthy();
  });

  it("rejects executable mime", () => {
    const r = parseMockFileDescriptor({
      ...MOCK_SAFE_IMAGE,
      mimeType: "application/octet-stream",
    });
    expect(r.file).toBeNull();
  });

  it("rejects negative sizeBytes", () => {
    const r = parseMockFileDescriptor({ ...MOCK_SAFE_IMAGE, sizeBytes: -1 });
    expect(r.file).toBeNull();
  });

  it("rejects empty mockHash", () => {
    const r = parseMockFileDescriptor({ ...MOCK_SAFE_IMAGE, mockHash: "" });
    expect(r.file).toBeNull();
  });

  it("rejects non-object input", () => {
    const r = parseMockFileDescriptor("not-json");
    expect(r.file).toBeNull();
  });

  it("rejects path traversal in fileName", () => {
    const r = parseMockFileDescriptor({ ...MOCK_SAFE_IMAGE, fileName: "../etc/passwd" });
    expect(r.file).toBeNull();
  });
});
