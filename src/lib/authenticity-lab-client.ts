import type { InspectionReport } from "@/lib/authenticity-lab/types";
import type { LabScenario } from "@/lib/authenticity-lab/scenarios";
import type { TrustSignal } from "@/lib/authenticity-lab/trust-flow";
import type { InspectionRow } from "@/lib/inspections-admin";

type RunResponse = {
  report: InspectionReport;
  trustSignals: TrustSignal[];
  persistedId: string | null;
  persistWarning: string | null;
  reviewQueue?: { pending: number; items: unknown[] };
};

async function adminFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<{ data: T | null; error: string | null; forbidden: boolean }> {
  const res = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (res.status === 403) return { data: null, error: null, forbidden: true };
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    return { data: null, error: body.error ?? "Request failed", forbidden: false };
  }
  const data = (await res.json()) as T;
  return { data, error: null, forbidden: false };
}

export async function fetchLabScenarios(accessToken: string) {
  const r = await adminFetch<{ scenarios: LabScenario[] }>(
    "/api/admin/authenticity-lab/scenarios",
    accessToken,
  );
  return { scenarios: r.data?.scenarios ?? [], error: r.error, forbidden: r.forbidden };
}

export async function runLabScenario(
  scenarioId: string,
  accessToken: string,
  options?: { detectionAdapterKind?: string; testBlockedHashes?: string[] },
) {
  const r = await adminFetch<RunResponse>("/api/admin/authenticity-lab/run", accessToken, {
    method: "POST",
    body: JSON.stringify({ scenarioId, ...options }),
  });
  return {
    report: r.data?.report ?? null,
    trustSignals: r.data?.trustSignals ?? null,
    persistedId: r.data?.persistedId ?? null,
    persistWarning: r.data?.persistWarning ?? null,
    reviewQueue: r.data?.reviewQueue ?? null,
    error: r.error,
    forbidden: r.forbidden,
  };
}

export async function runLabCustomMock(
  mockFile: unknown,
  accessToken: string,
  options?: { detectionAdapterKind?: string; testBlockedHashes?: string[] },
) {
  const r = await adminFetch<RunResponse>("/api/admin/authenticity-lab/run-custom", accessToken, {
    method: "POST",
    body: JSON.stringify({ mockFile, ...options }),
  });
  return {
    report: r.data?.report ?? null,
    trustSignals: r.data?.trustSignals ?? null,
    persistedId: r.data?.persistedId ?? null,
    persistWarning: r.data?.persistWarning ?? null,
    error: r.error,
    forbidden: r.forbidden,
  };
}

export async function fetchLabHistory(accessToken: string) {
  const r = await adminFetch<{ rows: InspectionRow[] }>(
    "/api/admin/authenticity-lab/history",
    accessToken,
  );
  return { rows: r.data?.rows ?? [], error: r.error, forbidden: r.forbidden };
}

export async function fetchLabPolicy(accessToken: string) {
  const r = await adminFetch<{
    policy: {
      version: string;
      fusion_weights: Record<string, number>;
      risk_threshold: Record<string, number>;
      review_rules: Record<string, unknown>;
    };
    reviewQueue: { pending: number; items: unknown[] };
    detectionKinds: string[];
  }>("/api/admin/authenticity-lab/policy", accessToken);
  return {
    policy: r.data?.policy ?? null,
    reviewQueue: r.data?.reviewQueue ?? null,
    detectionKinds: r.data?.detectionKinds ?? [],
    error: r.error,
    forbidden: r.forbidden,
  };
}
