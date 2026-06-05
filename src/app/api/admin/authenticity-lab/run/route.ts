import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { getReviewQueueSnapshot, runLabInspection } from "@/lib/authenticity-lab-admin";
import { validateRunScenarioBody, type RunScenarioBody } from "@/lib/authenticity-lab/safety/api-input";

export async function POST(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validated = validateRunScenarioBody(body as RunScenarioBody);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const result = await runLabInspection({
    scenarioId: validated.scenarioId,
    testBlockedHashes: validated.testBlockedHashes,
    detectionAdapterKind: validated.detectionAdapterKind,
    adminEmail: auth.email,
  });

  if (result.error || !result.report) {
    return NextResponse.json({ error: result.error ?? "Inspection failed" }, { status: 500 });
  }

  return NextResponse.json({
    report: result.report,
    trustSignals: result.trustSignals,
    persistedId: result.persistedId,
    persistWarning: result.persistWarning,
    reviewQueue: getReviewQueueSnapshot(),
  });
}
