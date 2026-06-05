import type { MockFileDescriptor } from "../types";

export const MOCK_SAFE_IMAGE: MockFileDescriptor = {
  mockId: "mock_safe_image_001",
  fileName: "portrait.jpg",
  mimeType: "image/jpeg",
  sizeBytes: 204800,
  mockHash: "MOCK_HASH_SAFE_001",
  metadata: { source: "lab_fixture" },
};

export const MOCK_SYNTHETIC_VIDEO: MockFileDescriptor = {
  mockId: "mock_synth_video_001",
  fileName: "deepfake_clip.mp4",
  mimeType: "video/mp4",
  sizeBytes: 5_000_000,
  mockHash: "MOCK_VIDEO_HIGH_RISK_SYNTH",
  metadata: { synthetic: "true", impersonation: "true" },
};

export const MOCK_VOICE_REVIEW: MockFileDescriptor = {
  mockId: "mock_voice_001",
  fileName: "sample.wav",
  mimeType: "audio/wav",
  sizeBytes: 512000,
  mockHash: "MOCK_HASH_VOICE_001",
  metadata: { voice_clone: "mock" },
};

export const MOCK_BLOCKED_EXT: MockFileDescriptor = {
  mockId: "mock_blocked_ext_001",
  fileName: "payload.exe",
  mimeType: "application/octet-stream",
  sizeBytes: 1024,
  mockHash: "MOCK_HASH_EXT",
};

export const MOCK_MALWARE: MockFileDescriptor = {
  mockId: "mock_malware_001",
  fileName: "clip.mp4",
  mimeType: "video/mp4",
  sizeBytes: 4096,
  mockHash: "MOCK_MALWARE_SIG",
};

export const MOCK_CSAM_HASH: MockFileDescriptor = {
  mockId: "mock_csam_branch_001",
  fileName: "test.png",
  mimeType: "image/png",
  sizeBytes: 1000,
  mockHash: "MOCK_BLOCKED_HASH_001",
};
