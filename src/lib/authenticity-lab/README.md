# UARION Authenticity Lab

Mock-only verification pipeline. **No real file upload, no external detection models.**

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Policy-as-Code | `/policy/authenticity-policy.json` | MIME, keywords, thresholds, fusion weights |
| Policy resolve | `policy/resolve.ts` | Test-only `MOCK_BLOCKED_HASH_*` merge |
| State machine | `state-machine/transitions.ts` | 8 states, explicit transition table |
| FusionRisk v3 | `pipeline/fusion-risk.ts` | UARION weighted fusion + confidence + correlation |
| Pipeline modules | `pipeline/*` | Interfaces + mock implementations |
| Orchestrator | `pipeline/orchestrator.ts` | 10-step mock pipeline |
| Trust flow | `trust-flow.ts` | market / registry / certification signals |
| Trust integration | `trust-flow-integration.ts` | Product action types (Sell→Market 설계) |
| Safety guards | `safety/runtime-guard.ts`, `safety/api-input.ts` | mock-only, API validation, CSAM 제한 |
| Persistence | `src/lib/inspections-admin.ts` | Supabase `inspections` + audit log |
| Admin API | `/api/admin/authenticity-lab/*` | scenarios, run, run-custom, history, policy |
| Admin UI | `/admin/authenticity-lab` | Lab console (admin-only) |

## UARION proprietary logic (FusionRisk v3)

```
fused = Σ(weight × score) + keywordBoost + metadataBoost + labelBoost + correlationBoost
```

| Signal | Source | Notes |
|--------|--------|-------|
| policy / hash / malware | Pipeline modules | Policy-as-Code weights |
| image / video / voice | Detection adapters | **Confidence-weighted** (`0.55 + 0.45×conf`) |
| keywordBoost | Filename + metadata keywords | Capped by `keyword_boost_cap` |
| metadataBoost | `synthetic`, `impersonation` metadata | Max 0.22 |
| labelBoost | High-risk detection labels | Max 0.12 |
| correlationBoost | 2+ modalities ≥ 0.4 | +0.05 |

`trustTierFromFusion()` maps fused score → `cleared_mock` / `caution` / `review` / `restricted`.

## State machine

```
PENDING → PRE_BLOCKED | MALWARE_BLOCKED | REVIEW_REQUIRED | SAFE | BLOCKED | AUDIT_LOCKED
         → SOURCE_DELETED (retention policy)
REVIEW_REQUIRED → SAFE | BLOCKED | AUDIT_LOCKED (human mock)
```

Invalid transitions throw — see `applyTransition()`.

## Detection adapters

| Kind | Behavior |
|------|----------|
| `mock` | Default `MockDetectionAdapter` per modality |
| `stub_external` | Same interface, +0.08 score, `external_adapter_not_configured` label |

## Trust flow

```
InspectionReport → deriveTrustSignals() → market | registry | certification
```

Levels: `blocked` | `restricted` | `review` | `caution` | `cleared_mock`

## Type glossary

| Type | File | Purpose |
|------|------|---------|
| `MockFileDescriptor` | `types.ts` | Mock input — never a real upload |
| `FusionBreakdown` | `types.ts` | Per-signal fusion decomposition |
| `InspectionReport` | `types.ts` | Full mock inspection output |
| `DetectionAdapterKind` | `detection-registry.ts` | `mock` \| `stub_external` |
| `AuthenticityPolicy` | `policy/types.ts` | Loaded policy shape |

## Edge cases (tested)

- Non-`mock_` mockId → upload gate fail
- `MOCK_BLOCKED_HASH_*` only in test policy override (production `blocked_hashes` empty)
- CSAM branch: hash match → `SOURCE_DELETED`
- Voice modality → always human review path
- `stub_external` elevates fusion vs `mock`
- Expression guard blocks legal/certainty claims in report JSON
- Invalid state transitions throw

## Security

상세: [`docs/AUTHENTICITY-LAB-SECURITY.md`](../../../docs/AUTHENTICITY-LAB-SECURITY.md)

- Admin API: Bearer + `ADMIN_EMAIL`
- `testBlockedHashes` → `csam_branch` only
- Policy loader strips non-`MOCK_BLOCKED_HASH_*` from `blocked_hashes`
- Real detection modes rejected at API

## Safety checklist

- [x] No `<input type="file">` in Lab UI
- [x] No real hashes in policy `blocked_hashes`
- [x] Expression guard blocks forbidden legal claims
- [x] Admin-only via `ADMIN_EMAIL` + Bearer token
- [x] Custom JSON validated by `parseMockFileDescriptor()` — no arbitrary uploads

## Tests

```bash
npm run test
```

Coverage areas: fusion-risk, state machine, orchestrator integration, trust-flow, detection-registry, human-review, policy resolve, validate-descriptor, expression-guard.

## Supabase setup (persistence)

Run `supabase/setup-inspections-table.sql` in SQL Editor. Until then, API returns `persistWarning` but pipeline still runs.
