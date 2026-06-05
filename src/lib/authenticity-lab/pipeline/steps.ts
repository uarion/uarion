import type { PipelineStepId } from "../types";

/** 10-step Lab visualization order (UI only) */
export const LAB_PIPELINE_STEPS: { id: PipelineStepId; order: number; label: string }[] = [
  { id: "upload_gate", order: 1, label: "Upload Gate" },
  { id: "policy_engine", order: 2, label: "Policy Engine" },
  { id: "hash_check", order: 3, label: "Hash Check" },
  { id: "malware_scan", order: 4, label: "Malware Scan" },
  { id: "detection_image", order: 5, label: "Detection (Image)" },
  { id: "detection_video", order: 6, label: "Detection (Video)" },
  { id: "detection_voice", order: 7, label: "Detection (Voice)" },
  { id: "fusion_risk", order: 8, label: "FusionRisk" },
  { id: "human_review", order: 9, label: "Human Review" },
  { id: "report_builder", order: 10, label: "Report Builder" },
];
