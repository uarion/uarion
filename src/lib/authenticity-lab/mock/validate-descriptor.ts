import type { MockFileDescriptor } from "../types";

const ALLOWED_MIME_PREFIXES = ["image/", "video/", "audio/"];

export function parseMockFileDescriptor(raw: unknown): {
  file: MockFileDescriptor | null;
  error: string | null;
} {
  if (!raw || typeof raw !== "object") {
    return { file: null, error: "Invalid mock descriptor object" };
  }

  const o = raw as Record<string, unknown>;
  const mockId = typeof o.mockId === "string" ? o.mockId.trim() : "";
  const fileName = typeof o.fileName === "string" ? o.fileName.trim() : "";
  const mimeType = typeof o.mimeType === "string" ? o.mimeType.trim() : "";
  const mockHash = typeof o.mockHash === "string" ? o.mockHash.trim() : "";
  const sizeBytes = typeof o.sizeBytes === "number" ? o.sizeBytes : 0;

  if (!mockId.startsWith("mock_")) {
    return { file: null, error: "mockId must start with mock_" };
  }
  if (!fileName || fileName.length > 200) {
    return { file: null, error: "Invalid fileName" };
  }
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return { file: null, error: "fileName must not contain path segments" };
  }
  if (!ALLOWED_MIME_PREFIXES.some((p) => mimeType.startsWith(p))) {
    return { file: null, error: "mimeType must be image/*, video/*, or audio/*" };
  }
  if (!mockHash || mockHash.length > 128) {
    return { file: null, error: "Invalid mockHash" };
  }
  if (sizeBytes <= 0 || sizeBytes > 500_000_000) {
    return { file: null, error: "sizeBytes out of range" };
  }

  let metadata: Record<string, string> | undefined;
  if (o.metadata !== undefined) {
    if (typeof o.metadata !== "object" || o.metadata === null) {
      return { file: null, error: "metadata must be object" };
    }
    metadata = {};
    for (const [k, v] of Object.entries(o.metadata as Record<string, unknown>)) {
      if (typeof v === "string" && k.length <= 64) metadata[k] = v;
    }
  }

  return {
    file: { mockId, fileName, mimeType, sizeBytes, mockHash, metadata },
    error: null,
  };
}
