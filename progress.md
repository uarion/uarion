# UARION Agent 진행 기록

> Agent가 자율 작업 시 이 파일에 누적 기록한다. 사용자 복귀 시 여기부터 확인.

---

## 진행 로그

- [2026-06-05] 완료: **터미널 cd 금지 규칙** — `CLAUDE.md`에 기록. 프로젝트 루트에서 `cd` 없이 명령만 실행 (승인 요청 방지)
- [2026-06-05] 완료: `.claude/settings.json` + `.cursor/permissions.json` 자동 실행 권한
- [2026-06-06] 완료: **Authenticity Lab Phase 1** 전체 큐
  1. Policy-as-Code — `policy/authenticity-policy.json`
  2. 상태머신 — `state-machine/transitions.ts` (8 states + 전이규칙)
  3. 파이프라인 11모듈 (mock + 인터페이스 분리) — UploadGate, PolicyEngine, HashCheck, MalwareScan, DetectionEngine×3, FusionRisk, HumanReview, ReportBuilder, SourceDelete, Orchestrator
  4. 단위·통합 테스트 — **22 tests passed** (`npm run test`)
  5. 관리자 Lab UI — `/admin/authenticity-lab` (mock 시나리오 버튼, 10단계 시각화, 리포트 카드, STATIC MOCKUP 배너)
  6. Admin API — `GET /api/admin/authenticity-lab/scenarios`, `POST .../run` (ADMIN_EMAIL 검증)
  7. FusionRisk v2 — metadataBoost + labelBoost (UARION 독자 로직 정교화)
  8. `npm run build` 성공

---

- [2026-06-05] 완료: **Authenticity Lab Phase 2**
  1. Supabase `inspections` + `inspection_audit_log` SQL (`supabase/setup-inspections-table.sql`)
  2. 영속화 — `inspections-admin.ts`, run/run-custom API에서 persist + `persistWarning`
  3. 신뢰 흐름 — `trust-flow.ts` (market/registry/certification 신호)
  4. Detection 어댑터 — `detection-registry.ts` (`mock` / `stub_external`)
  5. Policy resolve — `resolve.ts` + CSAM 테스트 전용 `MOCK_BLOCKED_HASH_*` override
  6. Human Review 큐 — in-memory dual reviewer (`human-review-queue.ts`)
  7. Custom mock JSON — `validate-descriptor.ts` + `POST .../run-custom`
  8. Admin API — `GET .../history`, `GET .../policy`
  9. Lab UI 확장 — policy 가중치, 큐, 어댑터 선택, custom JSON, trust signals, 이력, CSAM 배너
  10. 테스트 **30 passed**, `npm run build` 성공

## 진행 중

_(없음)_

---

## 다음 작업 (Phase 3)

- FusionRisk 가중치 A/B 튜닝 UI (policy JSON 실시간 반영 — read-only → editable)
- `stub_external` 어댑터 실제 HTTP 스텁 서버 (로컬 mock만)
- 제품(`product_id`) 연동 검사 이력 필터
- Audit trail 대시보드 (append-only log 뷰어)

---

## 개선 아이디어

- Lab 시나리오 저장/북마크 (admin preset)
- 검사 리포트 PDF export (mock watermark)

---

## 권한상 보류

_(없음)_

---

## push 대기 목록

- [2026-06-06] push 대기: **Authenticity Lab Phase 1** (`86918d1`) — Policy-as-Code, 파이프라인, 테스트, `/admin/authenticity-lab`, vitest, permissions 갱신
- [2026-06-05] push 대기: **Authenticity Lab Phase 2** — inspections 영속화, trust-flow, detection-registry, Lab UI 확장, 30 tests — 사용자 검토 후 push

---

## 안전 체크리스트 (Authenticity Lab)

| 항목 | 상태 |
|------|------|
| 실제 `<input type="file">` | 없음 — 시나리오 버튼만 |
| 실제 탐지 모델 연결 | 없음 — MockDetectionAdapter |
| 실제 파일 처리 | 없음 — MockFileDescriptor만 |
| policy `blocked_hashes` | 빈 배열 (운영) |
| 헤더/nav 노출 | 없음 — `/admin/authenticity-lab`만 |
| 표현 원칙 강제 | expression-guard + UI 문구 |

---

## 사용자 검토·승인 필요

| 항목 | 내용 |
|------|------|
| **push** | 위 push 대기 커밋 검토 후 `git push` |
| **로컬 확인** | 관리자 로그인 → http://localhost:3000/admin/authenticity-lab |
| **시나리오** | 6개 mock 버튼 + custom JSON + CSAM 분기 + policy/이력 패널 확인 |
| **Supabase SQL** | SQL Editor에서 `supabase/setup-inspections-table.sql` 실행 (영속화·이력) |
