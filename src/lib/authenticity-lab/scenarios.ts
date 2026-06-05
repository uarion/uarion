import type { MockFileDescriptor } from "./types";
import {
  MOCK_BLOCKED_EXT,
  MOCK_CSAM_HASH,
  MOCK_MALWARE,
  MOCK_SAFE_IMAGE,
  MOCK_SYNTHETIC_VIDEO,
  MOCK_VOICE_REVIEW,
} from "./mock/fixtures";

export type LabScenario = {
  id: string;
  label: string;
  description: string;
  file: MockFileDescriptor;
};

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: "safe_image",
    label: "안전 이미지 (mock)",
    description: "기본 정책 통과 · 낮은 융합 위험",
    file: MOCK_SAFE_IMAGE,
  },
  {
    id: "synthetic_video",
    label: "합성 영상 신호 (mock)",
    description: "deepfake 키워드 + 합성 메타데이터 · FusionRisk 상승",
    file: MOCK_SYNTHETIC_VIDEO,
  },
  {
    id: "voice_review",
    label: "음성 검토 경로 (mock)",
    description: "voice 모달리티 · Human Review 분기",
    file: MOCK_VOICE_REVIEW,
  },
  {
    id: "blocked_ext",
    label: "차단 확장자 (mock)",
    description: "Policy Engine PRE_BLOCKED",
    file: MOCK_BLOCKED_EXT,
  },
  {
    id: "malware",
    label: "악성 시그니처 (mock)",
    description: "Malware Scan → SOURCE_DELETED",
    file: MOCK_MALWARE,
  },
  {
    id: "csam_branch",
    label: "CSAM 분기 구조 (mock)",
    description: "테스트용 blocked hash 정책 오버라이드 필요 · 구조 시연",
    file: MOCK_CSAM_HASH,
  },
];
