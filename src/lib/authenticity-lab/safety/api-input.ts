import { LAB_SCENARIOS } from "../scenarios";
import { resolveDetectionAdapterKind } from "./runtime-guard";

const MAX_TEST_HASHES = 5;

export type RunScenarioBody = {
  scenarioId?: string;
  testBlockedHashes?: unknown;
  detectionAdapterKind?: string;
};

export type RunCustomBody = {
  mockFile?: unknown;
  testBlockedHashes?: unknown;
  detectionAdapterKind?: string;
};

function parseTestHashes(raw: unknown): string[] | { error: string } {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) return { error: "testBlockedHashes must be an array" };
  if (raw.length > MAX_TEST_HASHES) {
    return { error: `testBlockedHashes max ${MAX_TEST_HASHES} items` };
  }
  for (const item of raw) {
    if (typeof item !== "string") return { error: "testBlockedHashes must be strings" };
  }
  return raw as string[];
}

export function validateRunScenarioBody(body: RunScenarioBody):
  | { ok: true; scenarioId: string; testBlockedHashes?: string[]; detectionAdapterKind: import("../pipeline/detection-registry").DetectionAdapterKind }
  | { ok: false; error: string; status: number } {
  const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId.trim() : "";
  if (!scenarioId) {
    return { ok: false, error: "scenarioId is required", status: 400 };
  }

  const known = LAB_SCENARIOS.some((s) => s.id === scenarioId);
  if (!known) {
    return { ok: false, error: "Unknown scenarioId", status: 400 };
  }

  const adapter = resolveDetectionAdapterKind(body.detectionAdapterKind);
  if ("error" in adapter) {
    return { ok: false, error: adapter.error, status: 400 };
  }

  const hashes = parseTestHashes(body.testBlockedHashes);
  if ("error" in hashes) {
    return { ok: false, error: hashes.error, status: 400 };
  }

  if (scenarioId !== "csam_branch" && hashes.length > 0) {
    return {
      ok: false,
      error: "testBlockedHashes only allowed for csam_branch scenario",
      status: 400,
    };
  }

  return {
    ok: true,
    scenarioId,
    testBlockedHashes: hashes.length ? hashes : undefined,
    detectionAdapterKind: adapter.kind,
  };
}

export function validateRunCustomBody(body: RunCustomBody):
  | { ok: true; mockFile: unknown; detectionAdapterKind: import("../pipeline/detection-registry").DetectionAdapterKind }
  | { ok: false; error: string; status: number } {
  if (body.mockFile === undefined) {
    return { ok: false, error: "mockFile is required", status: 400 };
  }

  if (body.testBlockedHashes !== undefined) {
    return {
      ok: false,
      error: "testBlockedHashes not allowed on run-custom — use csam_branch scenario",
      status: 400,
    };
  }

  const adapter = resolveDetectionAdapterKind(body.detectionAdapterKind);
  if ("error" in adapter) {
    return { ok: false, error: adapter.error, status: 400 };
  }

  return { ok: true, mockFile: body.mockFile, detectionAdapterKind: adapter.kind };
}
