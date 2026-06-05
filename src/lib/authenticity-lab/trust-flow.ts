import type { InspectionReport, InspectionStatus } from "./types";

export type TrustSurface = "market" | "registry" | "certification";

export type TrustSignal = {
  surface: TrustSurface;
  level: "blocked" | "restricted" | "review" | "caution" | "cleared_mock";
  message: string;
  inspectionId: string;
};

const BLOCKED_STATUSES: InspectionStatus[] = [
  "PRE_BLOCKED",
  "MALWARE_BLOCKED",
  "BLOCKED",
  "SOURCE_DELETED",
  "AUDIT_LOCKED",
];

/** UARION 신뢰 흐름 — 검사 결과를 마켓/등록소/인증 표면에 매핑 */
export function deriveTrustSignals(report: InspectionReport): TrustSignal[] {
  const level = mapStatusToLevel(report.status, report.trustTier);
  const base = report.inspectionId;

  return [
    {
      surface: "market",
      level,
      message: marketMessage(level),
      inspectionId: base,
    },
    {
      surface: "registry",
      level,
      message: registryMessage(level),
      inspectionId: base,
    },
    {
      surface: "certification",
      level,
      message: certificationMessage(level),
      inspectionId: base,
    },
  ];
}

function mapStatusToLevel(
  status: InspectionStatus,
  tier: InspectionReport["trustTier"],
): TrustSignal["level"] {
  if (BLOCKED_STATUSES.includes(status)) return "blocked";
  if (status === "REVIEW_REQUIRED" || tier === "review") return "review";
  if (tier === "restricted") return "restricted";
  if (tier === "caution") return "caution";
  return "cleared_mock";
}

function marketMessage(level: TrustSignal["level"]): string {
  const m: Record<TrustSignal["level"], string> = {
    blocked: "마켓 노출 차단 (mock 판정)",
    restricted: "마켓 노출 제한 권고 (mock)",
    review: "마켓 등록 전 검토 대기 (mock)",
    caution: "마켓 주의 배지 표시 (mock)",
    cleared_mock: "마켓 mock 클리어 — 실제 검증 아님",
  };
  return m[level];
}

function registryMessage(level: TrustSignal["level"]): string {
  const m: Record<TrustSignal["level"], string> = {
    blocked: "등록소 기록 보류/차단 (mock)",
    restricted: "등록소 제한 등급 (mock)",
    review: "등록소 검토 큐 (mock)",
    caution: "등록소 주의 등급 (mock)",
    cleared_mock: "등록소 mock 등재 가능 — 실제 검증 아님",
  };
  return m[level];
}

function certificationMessage(level: TrustSignal["level"]): string {
  const m: Record<TrustSignal["level"], string> = {
    blocked: "인증 배지 발급 불가 (mock)",
    restricted: "인증 제한 (mock)",
    review: "인증 심사 대기 (mock)",
    caution: "조건부 인증 검토 (mock)",
    cleared_mock: "mock 인증 후보 — 법적 인증 아님",
  };
  return m[level];
}
