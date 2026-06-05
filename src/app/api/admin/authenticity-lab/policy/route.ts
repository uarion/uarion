import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { getLabPolicySummary, getReviewQueueSnapshot } from "@/lib/authenticity-lab-admin";

export async function GET(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  return NextResponse.json({
    policy: getLabPolicySummary(),
    reviewQueue: getReviewQueueSnapshot(),
    detectionKinds: ["mock", "stub_external"],
  });
}
