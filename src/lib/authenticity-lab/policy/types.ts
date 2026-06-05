export type RiskThresholds = {
  pre_block: number;
  review_required: number;
  block: number;
  audit_lock: number;
};

export type RetentionPolicy = {
  evidence_days: number;
  audit_log_days: number;
  mock_artifact_ttl_hours: number;
  source_delete_after_block: boolean;
};

export type ReviewRules = {
  always_review_modalities: string[];
  auto_escalate_fusion_above: number;
  require_dual_reviewer_above: number;
  max_auto_safe_fusion: number;
};

export type FusionWeights = {
  policy: number;
  hash: number;
  malware: number;
  image_detection: number;
  video_detection: number;
  voice_detection: number;
  keyword_boost_cap: number;
};

export type AuthenticityPolicy = {
  version: string;
  name: string;
  description: string;
  allowed_mime: string[];
  blocked_extensions: string[];
  blocked_hashes: string[];
  high_risk_keywords: string[];
  risk_threshold: RiskThresholds;
  retention_policy: RetentionPolicy;
  review_rules: ReviewRules;
  fusion_weights: FusionWeights;
};
