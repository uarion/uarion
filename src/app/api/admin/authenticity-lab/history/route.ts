import { NextResponse } from "next/server";
import { verifyAdminBearerToken } from "@/lib/adminAuth";
import { listRecentInspections } from "@/lib/authenticity-lab-admin";

export async function GET(request: Request) {
  const auth = await verifyAdminBearerToken(request.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { rows, error } = await listRecentInspections(25);
  if (error) {
    return NextResponse.json({ error, rows: [] }, { status: 500 });
  }

  return NextResponse.json({ rows });
}
