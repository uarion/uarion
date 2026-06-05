import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { parseMockFileDescriptor, runLabInspection } from "@/lib/authenticity-lab-admin";
import type { DetectionAdapterKind } from "@/lib/authenticity-lab/pipeline/detection-registry";

export async function POST(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: {
    mockFile?: unknown;
    testBlockedHashes?: string[];
    detectionAdapterKind?: DetectionAdapterKind;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseMockFileDescriptor(body.mockFile);
  if (!parsed.file) {
    return NextResponse.json({ error: parsed.error ?? "Invalid mock descriptor" }, { status: 400 });
  }

  const result = await runLabInspection({
    mockFile: parsed.file,
    testBlockedHashes: body.testBlockedHashes,
    detectionAdapterKind: body.detectionAdapterKind,
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
  });
}
