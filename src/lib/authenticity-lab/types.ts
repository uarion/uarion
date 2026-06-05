/** UARION Authenticity Lab — shared types (mock-only pipeline) */

export type InspectionStatus =
  | "PENDING"
  | "PRE_BLOCKED"
  | "MALWARE_BLOCKED"
  | "REVIEW_REQUIRED"
  | "SAFE"
  | "BLOCKED"
  | "SOURCE_DELETED"
  | "AUDIT_LOCKED";

export type Modality = "image" | "video" | "voice";

/** Mock file descriptor — never a real uploaded file */
export type MockFileDescriptor = {
  mockId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  mockHash: string;
  metadata?: Record<string, string>;
};

export type PipelineStepId =
  | "upload_gate"
  | "policy_engine"
  | "hash_check"
  | "malware_scan"
  | "detection_image"
  | "detection_video"
  | "detection_voice"
  | "fusion_risk"
  | "human_review"
  | "report_builder"
  | "source_delete";

export type StepResult = {
  stepId: PipelineStepId;
  label: string;
  passed: boolean;
  score?: number;
  message: string;
  evidenceId?: string;
  durationMs: number;
};

export type FusionBreakdown = {
  policy: number;
  hash: number;
  malware: number;
  image: number;
  video: number;
  voice: number;
  keywordBoost: number;
  metadataBoost: number;
  raw: number;
  fused: number;
};

export type InspectionReport = {
  inspectionId: string;
  status: InspectionStatus;
  fusionScore: number;
  fusionBreakdown: FusionBreakdown;
  steps: StepResult[];
  trustTier: TrustTier;
  expressionSafe: boolean;
  expressionViolations: string[];
  auditTrail: AuditEntry[];
  createdAt: string;
  isMock: true;
  disclaimer: string;
};

export type TrustTier = "unverified" | "caution" | "review" | "restricted" | "cleared_mock";

export type AuditEntry = {
  at: string;
  action: string;
  actor: "system" | "mock_reviewer";
  fromStatus?: InspectionStatus;
  toStatus?: InspectionStatus;
  note?: string;
};

export type DetectionResult = {
  modality: Modality;
  mockScore: number;
  labels: string[];
  adapterId: string;
  confidence: number;
};

export type PolicyViolation = {
  code: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
};

export type HumanReviewDecision = "approve_mock" | "reject_mock" | "escalate_mock" | "pending";
