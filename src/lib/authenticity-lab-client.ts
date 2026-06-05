import type { InspectionReport } from "@/lib/authenticity-lab/types";
import type { LabScenario } from "@/lib/authenticity-lab/scenarios";

export async function fetchLabScenarios(accessToken: string): Promise<{
  scenarios: LabScenario[];
  error: string | null;
  forbidden: boolean;
}> {
  const res = await fetch("/api/admin/authenticity-lab/scenarios", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 403) return { scenarios: [], error: null, forbidden: true };
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    return { scenarios: [], error: body.error ?? "Failed to load scenarios", forbidden: false };
  }
  const body = (await res.json()) as { scenarios: LabScenario[] };
  return { scenarios: body.scenarios, error: null, forbidden: false };
}

export async function runLabScenario(
  scenarioId: string,
  accessToken: string,
): Promise<{ report: InspectionReport | null; error: string | null; forbidden: boolean }> {
  const res = await fetch("/api/admin/authenticity-lab/run", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenarioId }),
  });
  if (res.status === 403) return { report: null, error: null, forbidden: true };
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    return { report: null, error: body.error ?? "Run failed", forbidden: false };
  }
  const body = (await res.json()) as { report: InspectionReport };
  return { report: body.report, error: null, forbidden: false };
}
