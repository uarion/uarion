import type { MockFileDescriptor, PolicyViolation } from "../types";
import type { AuthenticityPolicy } from "../policy/types";
import type { PolicyEngineAdapter } from "./interfaces";

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export class UarionPolicyEngine implements PolicyEngineAdapter {
  async evaluate(file: MockFileDescriptor, policy: AuthenticityPolicy) {
    const start = Date.now();
    const violations: PolicyViolation[] = [];
    const ext = extensionOf(file.fileName);

    if (!policy.allowed_mime.includes(file.mimeType)) {
      violations.push({
        code: "MIME_NOT_ALLOWED",
        message: `MIME not in allowlist: ${file.mimeType}`,
        severity: "high",
      });
    }

    if (policy.blocked_extensions.includes(ext)) {
      violations.push({
        code: "EXTENSION_BLOCKED",
        message: `Extension blocked: ${ext}`,
        severity: "critical",
      });
    }

    const metaText = JSON.stringify(file.metadata ?? {}).toLowerCase();
    const keywordHits = policy.high_risk_keywords.filter((kw) =>
      metaText.includes(kw.toLowerCase()) || file.fileName.toLowerCase().includes(kw.toLowerCase()),
    );

    for (const kw of keywordHits) {
      violations.push({
        code: "KEYWORD_RISK",
        message: `High-risk keyword signal: ${kw}`,
        severity: "medium",
      });
    }

    const policyScore = Math.min(
      1,
      violations.reduce((acc, v) => {
        const w = v.severity === "critical" ? 0.45 : v.severity === "high" ? 0.3 : v.severity === "medium" ? 0.15 : 0.05;
        return acc + w;
      }, 0),
    );

    const passed = !violations.some((v) => v.severity === "critical" || v.severity === "high");

    return {
      step: {
        stepId: "policy_engine" as const,
        label: "Policy Engine (UARION)",
        passed,
        score: policyScore,
        message: passed
          ? `Policy check passed (${violations.length} low signals)`
          : `Policy violations: ${violations.map((v) => v.code).join(", ")}`,
        evidenceId: `ev_policy_${file.mockId}`,
        durationMs: Date.now() - start,
      },
      violations,
      policyScore,
    };
  }
}
