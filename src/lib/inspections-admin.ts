import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { InspectionReport } from "@/lib/authenticity-lab/types";

export type InspectionRow = {
  id: string;
  inspection_id: string;
  scenario_id: string | null;
  status: string;
  fusion_score: number;
  trust_tier: string;
  report_json: InspectionReport;
  is_mock: boolean;
  product_id: string | null;
  admin_email: string | null;
  created_at: string;
};

/** 서버 전용 — mock 검사 결과 + audit trail 영속화 */
export async function persistInspectionReport(
  report: InspectionReport,
  meta: { scenarioId?: string; adminEmail?: string; productId?: string },
): Promise<{ id: string | null; error: string | null }> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("inspections")
    .insert({
      inspection_id: report.inspectionId,
      scenario_id: meta.scenarioId ?? null,
      status: report.status,
      fusion_score: report.fusionScore,
      trust_tier: report.trustTier,
      report_json: report,
      is_mock: true,
      product_id: meta.productId ?? null,
      admin_email: meta.adminEmail ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { id: null, error: error.message };
  }

  if (report.auditTrail.length > 0) {
    const rows = report.auditTrail.map((e) => ({
      inspection_id: report.inspectionId,
      event_at: e.at,
      action: e.action,
      actor: e.actor,
      from_status: e.fromStatus ?? null,
      to_status: e.toStatus ?? null,
      note: e.note ?? null,
    }));

    const { error: auditError } = await supabase.from("inspection_audit_log").insert(rows);
    if (auditError) {
      return { id: data.id, error: `Saved inspection but audit log failed: ${auditError.message}` };
    }
  }

  return { id: data.id, error: null };
}

export async function listRecentInspections(limit = 20): Promise<{
  rows: InspectionRow[];
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("inspections")
    .select(
      "id, inspection_id, scenario_id, status, fusion_score, trust_tier, report_json, is_mock, product_id, admin_email, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { rows: [], error: error.message };
  }

  return { rows: (data ?? []) as InspectionRow[], error: null };
}
