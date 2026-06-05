import { LAB_DISCLAIMER, sanitizeLabText, scanExpressionViolations } from "../expression-guard";
import type { InspectionReport, StepResult } from "../types";
import type { ReportBuilderAdapter } from "./interfaces";

export class UarionReportBuilder implements ReportBuilderAdapter {
  async build(report: InspectionReport): Promise<StepResult> {
    const start = Date.now();
    const textBlob = JSON.stringify(report);
    const violations = scanExpressionViolations(textBlob);
    const safe = violations.length === 0;

    return {
      stepId: "report_builder" as const,
      label: "Report Builder (UARION)",
      passed: safe,
      message: safe
        ? sanitizeLabText(`Mock report ${report.inspectionId} built. ${LAB_DISCLAIMER}`)
        : `Expression guard flagged patterns: ${violations.join(", ")}`,
      evidenceId: `ev_report_${report.inspectionId}`,
      durationMs: Date.now() - start,
    };
  }
}
