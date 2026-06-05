import { runMockInspection } from "@/lib/authenticity-lab/pipeline/orchestrator";
import { LAB_SCENARIOS, type LabScenario } from "@/lib/authenticity-lab/scenarios";
import type { InspectionReport } from "@/lib/authenticity-lab/types";

/** 서버 전용 — mock 검사 실행 (실제 파일 처리 없음) */
export async function runLabScenario(scenarioId: string): Promise<{
  report: InspectionReport | null;
  error: string | null;
}> {
  const scenario = LAB_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) {
    return { report: null, error: "Unknown scenario" };
  }

  try {
    const report = await runMockInspection({
      file: scenario.file,
      inspectionId: `insp_lab_${scenarioId}_${Date.now()}`,
    });
    return { report, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Inspection failed";
    return { report: null, error: message };
  }
}

export function listLabScenarios(): LabScenario[] {
  return LAB_SCENARIOS;
}
