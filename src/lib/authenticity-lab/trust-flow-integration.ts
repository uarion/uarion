import type { InspectionReport } from "./types";
import { deriveTrustSignals, type TrustSignal, type TrustSurface } from "./trust-flow";

/**
 * UARION 제품 신뢰 연동 — 설계 타입 (DB/마켓 미연결).
 * Authenticity Lab 결과 → Sell / Registry / Market / Certification 표면 액션.
 */

export type TrustActionKind =
  | "block_listing"
  | "hide_listing"
  | "require_review"
  | "show_caution_badge"
  | "allow_mock_listing"
  | "block_registry_entry"
  | "queue_registry_review"
  | "deny_certification"
  | "queue_certification_review";

export type ProductTrustAction = {
  surface: TrustSurface;
  action: TrustActionKind;
  reason: string;
  inspectionId: string;
  isMock: true;
};

const LEVEL_TO_MARKET: Record<TrustSignal["level"], TrustActionKind> = {
  blocked: "hide_listing",
  restricted: "block_listing",
  review: "require_review",
  caution: "show_caution_badge",
  cleared_mock: "allow_mock_listing",
};

const LEVEL_TO_REGISTRY: Record<TrustSignal["level"], TrustActionKind> = {
  blocked: "block_registry_entry",
  restricted: "block_registry_entry",
  review: "queue_registry_review",
  caution: "queue_registry_review",
  cleared_mock: "allow_mock_listing",
};

const LEVEL_TO_CERT: Record<TrustSignal["level"], TrustActionKind> = {
  blocked: "deny_certification",
  restricted: "deny_certification",
  review: "queue_certification_review",
  caution: "queue_certification_review",
  cleared_mock: "allow_mock_listing",
};

/** 검사 리포트 → 표면별 권고 액션 (mock 전용, 실행하지 않음) */
export function deriveProductTrustActions(report: InspectionReport): ProductTrustAction[] {
  const signals = deriveTrustSignals(report);

  return signals.map((s) => {
    let action: TrustActionKind;
    if (s.surface === "market") action = LEVEL_TO_MARKET[s.level];
    else if (s.surface === "registry") action = LEVEL_TO_REGISTRY[s.level];
    else action = LEVEL_TO_CERT[s.level];

    return {
      surface: s.surface,
      action,
      reason: s.message,
      inspectionId: s.inspectionId,
      isMock: true as const,
    };
  });
}

/**
 * Sell → Lab → Market 흐름 (설계)
 *
 * 1. /sell 상품 등록 → status PENDING_REVIEW
 * 2. (미래) product_id로 Lab 검사 트리거 → inspections.product_id
 * 3. deriveProductTrustActions → 마켓 노출/배지/등록소/인증 게이트
 * 4. SAFE + cleared_mock → 마켓 mock 노출 가능 (법적 인증 아님)
 */
