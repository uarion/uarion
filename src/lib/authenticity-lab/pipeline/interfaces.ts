import type {
  DetectionResult,
  HumanReviewDecision,
  MockFileDescriptor,
  Modality,
  PolicyViolation,
  StepResult,
} from "../types";
import type { AuthenticityPolicy } from "../policy/types";

export interface UploadGateAdapter {
  validate(file: MockFileDescriptor): Promise<StepResult>;
}

export interface PolicyEngineAdapter {
  evaluate(file: MockFileDescriptor, policy: AuthenticityPolicy): Promise<{
    step: StepResult;
    violations: PolicyViolation[];
    policyScore: number;
  }>;
}

export interface HashCheckAdapter {
  check(file: MockFileDescriptor, policy: AuthenticityPolicy): Promise<{
    step: StepResult;
    matched: boolean;
    hashScore: number;
    csamBranchTriggered: boolean;
  }>;
}

export interface MalwareScanAdapter {
  scan(file: MockFileDescriptor): Promise<{
    step: StepResult;
    malwareScore: number;
    detected: boolean;
  }>;
}

export interface DetectionEngineAdapter {
  readonly modality: Modality;
  readonly adapterId: string;
  analyze(file: MockFileDescriptor): Promise<DetectionResult>;
}

export type MetadataSignals = {
  synthetic?: boolean;
  impersonation?: boolean;
};

export interface FusionRiskEngine {
  fuse(input: {
    policyScore: number;
    hashScore: number;
    malwareScore: number;
    detections: DetectionResult[];
    keywordHits: string[];
    metadataSignals?: MetadataSignals;
    policy: AuthenticityPolicy;
  }): import("../types").FusionBreakdown;
}

export interface HumanReviewAdapter {
  review(input: {
    fusionScore: number;
    modalities: Modality[];
    policy: AuthenticityPolicy;
  }): Promise<{
    step: StepResult;
    decision: HumanReviewDecision;
  }>;
}

export interface ReportBuilderAdapter {
  build(input: import("../types").InspectionReport): Promise<StepResult>;
}

export interface SourceDeleteAdapter {
  deleteSource(file: MockFileDescriptor, reason: string): Promise<StepResult>;
}
