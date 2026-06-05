import { runMockInspection } from "@/lib/authenticity-lab/pipeline/orchestrator";
import type { DetectionAdapterKind } from "@/lib/authenticity-lab/pipeline/detection-registry";
import { getHumanReviewQueue } from "@/lib/authenticity-lab/pipeline/human-review-queue";
import { loadAuthenticityPolicy } from "@/lib/authenticity-lab/policy/loader";
import { sanitizeTestBlockedHashes } from "@/lib/authenticity-lab/policy/resolve";
import { parseMockFileDescriptor } from "@/lib/authenticity-lab/mock/validate-descriptor";
import { LAB_SCENARIOS, type LabScenario } from "@/lib/authenticity-lab/scenarios";
import { deriveTrustSignals } from "@/lib/authenticity-lab/trust-flow";
import type { InspectionReport, MockFileDescriptor } from "@/lib/authenticity-lab/types";
import { listRecentInspections, persistInspectionReport } from "@/lib/inspections-admin";

export type RunLabOptions = {
  scenarioId?: string;
  mockFile?: MockFileDescriptor;
  testBlockedHashes?: string[];
  detectionAdapterKind?: DetectionAdapterKind;
  adminEmail?: string;
  persist?: boolean;
};

export type RunLabResult = {
  report: InspectionReport | null;
  trustSignals: ReturnType<typeof deriveTrustSignals> | null;
  persistedId: string | null;
  persistWarning: string | null;
  error: string | null;
};

export async function runLabInspection(options: RunLabOptions): Promise<RunLabResult> {
  let file: MockFileDescriptor | undefined = options.mockFile;
  const scenarioId = options.scenarioId;

  if (!file && scenarioId) {
    const scenario = LAB_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return emptyResult("Unknown scenario");
    }
    file = scenario.file;
  }

  if (!file) {
    return emptyResult("No mock file or scenario");
  }

  const testHashes = sanitizeTestBlockedHashes(options.testBlockedHashes);
  if (scenarioId === "csam_branch" && !testHashes.length) {
    testHashes.push("MOCK_BLOCKED_HASH_001");
  }

  try {
    const report = await runMockInspection({
      file,
      inspectionId: `insp_lab_${scenarioId ?? "custom"}_${Date.now()}`,
      testBlockedHashes: testHashes.length ? testHashes : undefined,
      detectionAdapterKind: options.detectionAdapterKind ?? "mock",
    });

    const trustSignals = deriveTrustSignals(report);

    let persistedId: string | null = null;
    let persistWarning: string | null = null;

    if (options.persist !== false) {
      const saved = await persistInspectionReport(report, {
        scenarioId,
        adminEmail: options.adminEmail,
      });
      persistedId = saved.id;
      if (saved.error) {
        persistWarning = saved.error;
      }
    }

    return {
      report,
      trustSignals,
      persistedId,
      persistWarning,
      error: null,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Inspection failed";
    return emptyResult(message);
  }
}

function emptyResult(error: string): RunLabResult {
  return {
    report: null,
    trustSignals: null,
    persistedId: null,
    persistWarning: null,
    error,
  };
}

export function listLabScenarios(): LabScenario[] {
  return LAB_SCENARIOS;
}

export function getLabPolicySummary() {
  const p = loadAuthenticityPolicy();
  return {
    version: p.version,
    risk_threshold: p.risk_threshold,
    fusion_weights: p.fusion_weights,
    review_rules: p.review_rules,
    blocked_hashes_count: p.blocked_hashes.length,
  };
}

export function getReviewQueueSnapshot() {
  const q = getHumanReviewQueue();
  return { pending: q.pendingCount(), items: q.list().slice(-10) };
}

export { parseMockFileDescriptor, listRecentInspections };
