# UARION Agent 진행 기록

> Agent가 자율 작업 시 이 파일에 누적 기록한다. 사용자 복귀 시 여기부터 확인.

---

## 진행 로그

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

## 진행 중

_(없음 — Phase 1 큐 완료)_

---

## 다음 작업 (Phase 2)

- Supabase `inspections` 테이블 + 감사 로그 영속화 (mock 결과 저장)
- 인증/등록소/마켓 신뢰 흐름 API 연결
- DetectionEngine 실제 어댑터 플러그인 (인터페이스 유지, 구현 교체)
- CSAM 분기 E2E — 테스트 전용 policy override API (운영 policy는 blocked_hashes 빈 목록 유지)

---

## 개선 아이디어

- FusionRisk 가중치를 policy JSON에서 A/B 튜닝 UI (admin)
- Human Review mock → 큐 시뮬레이션 (dual reviewer)
- Audit trail Supabase append-only
- Lab 시나리오 커스텀 JSON 입력 (mock descriptor만, 파일 업로드 없음)

---

## 권한상 보류

_(없음)_

---

## push 대기 목록

- [2026-06-06] push 대기: **Authenticity Lab Phase 1** — Policy-as-Code, 파이프라인, 테스트, `/admin/authenticity-lab`, vitest, permissions 갱신 — 사용자 검토 후 push

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
| **시나리오** | 6개 mock 버튼 각각 실행해 10단계·리포트 확인 |
