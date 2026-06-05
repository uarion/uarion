# Authenticity Lab — 보안·안전 설계

> 아침 검토용 요약. 코드: `src/lib/authenticity-lab/safety/`

## 관리자 접근 통제

| 계층 | 구현 |
|------|------|
| API | `verifyAdminBearerToken()` — Supabase JWT + `ADMIN_EMAIL` 일치 |
| UI | 클라이언트 Bearer 토큰; 비관리자 403 |
| HTTP | `/admin/*` X-Frame-Options DENY, `/api/admin/*` no-store |

**검토 필요:** `/admin` 페이지는 SSR 세션 검증 없음 (토큰은 클라이언트 localStorage). API는 서버에서 차단됨.

## Mock-only 경계

- `LAB_RUNTIME_MODE = mock_only`
- Detection: `mock` \| `stub_external` 만 허용. `real`/`live`/`production` → 400
- `ALLOW_REAL_LAB_MODE` 환경변수 있어도 실제 어댑터 미구현 (거부)
- 입력 파일: `mockId` must `mock_*`, `parseMockFileDescriptor()` 검증
- Upload Gate: mock descriptor 아니면 조기 실패

## CSAM 분기

- 운영 `blocked_hashes`: **항상 빈 배열**
- `loadAuthenticityPolicy()`: 비-MOCK 해시 런타임 제거
- 테스트 해시: `MOCK_BLOCKED_HASH_*` only
- API: `testBlockedHashes`는 **`csam_branch` 시나리오에서만** 허용
- `run-custom`은 `testBlockedHashes` **거부**

## API 입력 검증

`src/lib/authenticity-lab/safety/api-input.ts`

- `scenarioId` 화이트리스트 (6개 시나리오)
- `detectionAdapterKind` 화이트리스트
- `testBlockedHashes` 배열 타입·길이(≤5)·시나리오 제한

## 신뢰 흐름 (미연동)

`trust-flow-integration.ts` — 마켓/등록소/인증 **권고 액션** 타입만 정의. DB·마켓 코드 미변경.

```
/sell → PENDING_REVIEW → (미래) Lab + product_id → deriveProductTrustActions → 게이트
```

## 절대 금지 (야간 작업 준수)

- push, .env 읽기, 실제 탐지모델, 실파일 업로드, video_automation
