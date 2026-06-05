import { LAB_DISCLAIMER, scanExpressionViolations } from "../expression-guard";
import { loadAuthenticityPolicy } from "../policy/loader";
import { resolveInspectionPolicy } from "../policy/resolve";
import { applyTransition, fusionEventForScore } from "../state-machine/transitions";
import type {
  AuditEntry,
  FusionBreakdown,
  InspectionReport,
  InspectionStatus,
  MockFileDescriptor,
  Modality,
  PipelineStepId,
  StepResult,
} from "../types";
import { createDetectionAdapters, type DetectionAdapterKind } from "./detection-registry";
import { UarionFusionRisk, trustTierFromFusion } from "./fusion-risk";
import { MockHashCheck } from "./hash-check";
import { MockHumanReview } from "./human-review";
import { getHumanReviewQueue } from "./human-review-queue";
import { MockMalwareScan } from "./malware-scan";
import { UarionPolicyEngine } from "./policy-engine";
import { UarionReportBuilder } from "./report-builder";
import { MockSourceDelete } from "./source-delete";
import { MockUploadGate } from "./upload-gate";

function modalityFromMime(mime: string): Modality | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "voice";
  return null;
}

function stepIdForModality(m: Modality): PipelineStepId {
  if (m === "image") return "detection_image";
  if (m === "video") return "detection_video";
  return "detection_voice";
}

export type RunMockInspectionInput = {
  file: MockFileDescriptor;
  inspectionId?: string;
  /** 테스트 전용 — MOCK_BLOCKED_HASH_* 만 허용 */
  testBlockedHashes?: string[];
  detectionAdapterKind?: DetectionAdapterKind;
};

export async function runMockInspection(input: RunMockInspectionInput): Promise<InspectionReport> {
  const policy = resolveInspectionPolicy({
    testBlockedHashes: input.testBlockedHashes,
  });
  const inspectionId = input.inspectionId ?? `insp_mock_${Date.now()}`;
  const steps: StepResult[] = [];
  const auditTrail: AuditEntry[] = [];
  let status: InspectionStatus = "PENDING";

  const log = (action: string, from?: InspectionStatus, to?: InspectionStatus, note?: string) => {
    auditTrail.push({
      at: new Date().toISOString(),
      action,
      actor: "system",
      fromStatus: from,
      toStatus: to,
      note,
    });
  };

  log("INSPECTION_START", undefined, "PENDING", inspectionId);

  const uploadGate = new MockUploadGate();
  const uploadStep = await uploadGate.validate(input.file);
  steps.push(uploadStep);
  if (!uploadStep.passed) {
    status = applyTransition(status, "POLICY_FAIL");
    log("UPLOAD_GATE_FAIL", "PENDING", status);
    return buildReport(inspectionId, status, steps, auditTrail, zeroFusion());
  }

  const policyEngine = new UarionPolicyEngine();
  const policyResult = await policyEngine.evaluate(input.file, policy);
  steps.push(policyResult.step);

  const keywordHits = policy.high_risk_keywords.filter((kw) =>
    input.file.fileName.toLowerCase().includes(kw.toLowerCase()) ||
    JSON.stringify(input.file.metadata ?? {}).toLowerCase().includes(kw.toLowerCase()),
  );

  if (!policyResult.step.passed) {
    status = applyTransition(status, "POLICY_FAIL");
    log("POLICY_FAIL", "PENDING", status);
    if (policy.retention_policy.source_delete_after_block) {
      const del = await new MockSourceDelete().deleteSource(input.file, "policy_fail");
      steps.push(del);
      status = applyTransition(status, "SOURCE_DELETE");
      log("SOURCE_DELETE", "PRE_BLOCKED", status);
    }
    const fusion = new UarionFusionRisk().fuse({
      policyScore: policyResult.policyScore,
      hashScore: 0,
      malwareScore: 0,
      detections: [],
      keywordHits,
      policy,
    });
    return buildReport(inspectionId, status, steps, auditTrail, fusion);
  }

  const hashCheck = new MockHashCheck();
  const hashResult = await hashCheck.check(input.file, policy);
  steps.push(hashResult.step);

  if (hashResult.csamBranchTriggered) {
    status = applyTransition(status, "HASH_MATCH");
    log("CSAM_BRANCH_MOCK", "PENDING", status);
    const del = await new MockSourceDelete().deleteSource(input.file, "hash_block_mock");
    steps.push(del);
    status = applyTransition(status, "SOURCE_DELETE");
    log("SOURCE_DELETE", "MALWARE_BLOCKED", status);
    const fusion = new UarionFusionRisk().fuse({
      policyScore: policyResult.policyScore,
      hashScore: hashResult.hashScore,
      malwareScore: 1,
      detections: [],
      keywordHits,
      policy,
    });
    return buildReport(inspectionId, status, steps, auditTrail, fusion);
  }

  const malware = new MockMalwareScan();
  const malwareResult = await malware.scan(input.file);
  steps.push(malwareResult.step);

  if (malwareResult.detected) {
    status = applyTransition(status, "MALWARE_DETECTED");
    log("MALWARE_BLOCKED", "PENDING", status);
    const del = await new MockSourceDelete().deleteSource(input.file, "malware_mock");
    steps.push(del);
    const fromMalware = status;
    status = applyTransition(status, "SOURCE_DELETE");
    log("SOURCE_DELETE", fromMalware, status);
    const fusion = new UarionFusionRisk().fuse({
      policyScore: policyResult.policyScore,
      hashScore: hashResult.hashScore,
      malwareScore: malwareResult.malwareScore,
      detections: [],
      keywordHits,
      policy,
    });
    return buildReport(inspectionId, status, steps, auditTrail, fusion);
  }

  const adapters = createDetectionAdapters(input.detectionAdapterKind ?? "mock");
  const primaryModality = modalityFromMime(input.file.mimeType);
  const modalities: Modality[] = primaryModality ? [primaryModality] : [];

  const detections = [];
  for (const adapter of adapters) {
    if (primaryModality && adapter.modality !== primaryModality) continue;
    const result = await adapter.analyze(input.file);
    detections.push(result);
    steps.push({
      stepId: stepIdForModality(adapter.modality),
      label: `Detection ${adapter.modality} (${adapter.adapterId})`,
      passed: result.mockScore < policy.risk_threshold.review_required,
      score: result.mockScore,
      message: `Labels: ${result.labels.join(", ")}`,
      evidenceId: `ev_det_${adapter.modality}_${input.file.mockId}`,
      durationMs: 1,
    });
  }

  const fusionEngine = new UarionFusionRisk();
  const fusionBreakdown = fusionEngine.fuse({
    policyScore: policyResult.policyScore,
    hashScore: hashResult.hashScore,
    malwareScore: malwareResult.malwareScore,
    detections,
    keywordHits,
    metadataSignals: {
      synthetic: input.file.metadata?.synthetic === "true",
      impersonation: input.file.metadata?.impersonation === "true",
    },
    policy,
  });

  steps.push({
    stepId: "fusion_risk" as const,
    label: "FusionRisk (UARION)",
    passed: fusionBreakdown.fused < policy.risk_threshold.block,
    score: fusionBreakdown.fused,
    message: `Fused=${fusionBreakdown.fused.toFixed(3)} raw=${fusionBreakdown.raw.toFixed(3)}`,
    evidenceId: `ev_fusion_${inspectionId}`,
    durationMs: 1,
  });

  const fusionEvent = fusionEventForScore(fusionBreakdown.fused, policy.risk_threshold);
  const prev = status;
  status = applyTransition(status, fusionEvent);
  log("FUSION_DECISION", prev, status, fusionEvent);

  const humanReview = new MockHumanReview();
  const reviewResult = await humanReview.review({
    fusionScore: fusionBreakdown.fused,
    modalities,
    policy,
  });
  steps.push(reviewResult.step);

  if (reviewResult.decision === "pending" || status === "REVIEW_REQUIRED") {
    const q = getHumanReviewQueue().enqueue(fusionBreakdown.fused, policy);
    auditTrail.push({
      at: new Date().toISOString(),
      action: "HUMAN_REVIEW_QUEUED",
      actor: "system",
      note: `queue=${q.id} dual=${q.requiresDual}`,
    });
  }

  if (status === "REVIEW_REQUIRED") {
    if (reviewResult.decision === "approve_mock") {
      status = applyTransition(status, "HUMAN_APPROVE");
      log("HUMAN_APPROVE", "REVIEW_REQUIRED", status);
    } else if (reviewResult.decision === "reject_mock") {
      status = applyTransition(status, "HUMAN_REJECT");
      log("HUMAN_REJECT", "REVIEW_REQUIRED", status);
    } else if (reviewResult.decision === "escalate_mock") {
      status = applyTransition(status, "HUMAN_ESCALATE");
      log("HUMAN_ESCALATE", "REVIEW_REQUIRED", status);
    }
  }

  const draftReport = buildReport(inspectionId, status, steps, auditTrail, fusionBreakdown);
  const reportStep = await new UarionReportBuilder().build(draftReport);
  steps.push(reportStep);

  if (
    (status === "BLOCKED" || status === "MALWARE_BLOCKED" || status === "PRE_BLOCKED") &&
    policy.retention_policy.source_delete_after_block
  ) {
    const del = await new MockSourceDelete().deleteSource(input.file, `status_${status}`);
    steps.push(del);
    const from = status;
    status = applyTransition(status, "SOURCE_DELETE");
    log("SOURCE_DELETE", from, status);
  }

  return buildReport(inspectionId, status, steps, auditTrail, fusionBreakdown);
}

function zeroFusion(): FusionBreakdown {
  return {
    policy: 0,
    hash: 0,
    malware: 0,
    image: 0,
    video: 0,
    voice: 0,
    keywordBoost: 0,
    metadataBoost: 0,
    labelBoost: 0,
    correlationBoost: 0,
    raw: 0,
    fused: 0,
  };
}

function buildReport(
  inspectionId: string,
  status: InspectionStatus,
  steps: StepResult[],
  auditTrail: AuditEntry[],
  fusionBreakdown: FusionBreakdown,
): InspectionReport {
  const policy = loadAuthenticityPolicy();
  const textBlob = JSON.stringify({ status, steps });
  const expressionViolations = scanExpressionViolations(textBlob);

  return {
    inspectionId,
    status,
    fusionScore: fusionBreakdown.fused,
    fusionBreakdown,
    steps,
    trustTier: trustTierFromFusion(fusionBreakdown.fused, policy.risk_threshold),
    expressionSafe: expressionViolations.length === 0,
    expressionViolations,
    auditTrail,
    createdAt: new Date().toISOString(),
    isMock: true,
    disclaimer: LAB_DISCLAIMER,
  };
}
