# UARION Authenticity Lab

Mock-only verification pipeline. **No real file upload, no external detection models.**

## Architecture

| Layer | Path |
|-------|------|
| Policy-as-Code | `/policy/authenticity-policy.json` |
| State machine | `state-machine/transitions.ts` |
| Pipeline modules | `pipeline/*` (interfaces + mock impl) |
| Orchestrator | `pipeline/orchestrator.ts` |
| Admin API | `/api/admin/authenticity-lab/*` |
| Admin UI | `/admin/authenticity-lab` |

## UARION proprietary logic

- **FusionRisk** — weighted fusion of policy, hash, malware, modality scores, keywords, metadata signals
- **Policy Engine** — MIME, extension, keyword rules from static policy
- **State machine** — PENDING → SAFE / REVIEW_REQUIRED / BLOCKED / SOURCE_DELETED / AUDIT_LOCKED
- **Detection adapters** — pluggable `DetectionEngineAdapter`; current: `MockDetectionAdapter`

## Trust flow (future)

```
Sell/Registry → PENDING_REVIEW → Authenticity Lab → APPROVED/BLOCKED → Market
```

## Safety checklist

- [x] No `<input type="file">` in Lab UI
- [x] No real hashes in policy `blocked_hashes`
- [x] Expression guard blocks forbidden legal claims
- [x] Admin-only via `ADMIN_EMAIL` + Bearer token

## Tests

```bash
npm run test
```
