import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { runLabScenario } from "@/lib/authenticity-lab-admin";

export async function POST(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let scenarioId: string;
  try {
    const body = (await request.json()) as { scenarioId?: string };
    scenarioId = body.scenarioId ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!scenarioId) {
    return NextResponse.json({ error: "scenarioId is required" }, { status: 400 });
  }

  const { report, error } = await runLabScenario(scenarioId);
  if (error || !report) {
    return NextResponse.json({ error: error ?? "Inspection failed" }, { status: 500 });
  }

  return NextResponse.json({ report });
}
