# UARION Authenticity Policy-as-Code

Static policy bundle for Authenticity Lab. **No real file hashes or external detection.**

## Files

- `authenticity-policy.json` — allowed MIME, blocked extensions, risk thresholds, fusion weights, review rules

## Safety

- `blocked_hashes` must remain empty in production policy files.
- Use mock hash IDs in unit tests only (`MOCK_BLOCKED_HASH_*`).

## Consumption

Loaded server-side by `src/lib/authenticity-lab/policy/loader.ts`.
