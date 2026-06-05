"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { fetchLabScenarios, runLabScenario } from "@/lib/authenticity-lab-client";
import { LAB_PIPELINE_STEPS } from "@/lib/authenticity-lab/pipeline/steps";
import type { InspectionReport, PipelineStepId, StepResult } from "@/lib/authenticity-lab/types";
import type { LabScenario } from "@/lib/authenticity-lab/scenarios";

const STATUS_COLORS: Record<string, string> = {
  SAFE: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  REVIEW_REQUIRED: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  PRE_BLOCKED: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  BLOCKED: "text-red-400 border-red-500/40 bg-red-500/10",
  MALWARE_BLOCKED: "text-red-400 border-red-500/40 bg-red-500/10",
  SOURCE_DELETED: "text-slate-400 border-slate-500/40 bg-slate-500/10",
  AUDIT_LOCKED: "text-purple-400 border-purple-500/40 bg-purple-500/10",
  PENDING: "text-slate-400 border-slate-500/40 bg-slate-500/10",
};

function stepForId(steps: StepResult[], id: PipelineStepId): StepResult | undefined {
  return steps.find((s) => s.stepId === id);
}

export default function AdminAuthenticityLabPageClient() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [scenarios, setScenarios] = useState<LabScenario[]>([]);
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadScenarios = useCallback(async (token: string) => {
    const result = await fetchLabScenarios(token);
    if (result.forbidden) {
      setForbidden(true);
      setScenarios([]);
    } else if (result.error) {
      setFeedback(result.error);
    } else {
      setForbidden(false);
      setScenarios(result.scenarios);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await getSupabase().auth.getSession();
      if (!mounted) return;
      const token = data.session?.access_token ?? null;
      setAccessToken(token);
      setAuthLoading(false);
      if (token) await loadScenarios(token);
    }

    init();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
      const token = session?.access_token ?? null;
      setAccessToken(token);
      if (token) await loadScenarios(token);
      else {
        setScenarios([]);
        setForbidden(false);
        setReport(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadScenarios]);

  async function handleRun(scenarioId: string) {
    if (!accessToken) return;
    setRunningId(scenarioId);
    setFeedback(null);
    const result = await runLabScenario(scenarioId, accessToken);
    setRunningId(null);
    if (result.forbidden) {
      setForbidden(true);
      return;
    }
    if (result.error) {
      setFeedback(result.error);
      return;
    }
    setReport(result.report);
  }

  if (authLoading) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-8 w-72 rounded bg-navy-800" />
          <div className="h-48 rounded-xl bg-navy-900" />
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-navy-700 bg-navy-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Authenticity Lab</h1>
          <p className="text-body mt-3 text-slate-400">관리자 전용 — 로그인이 필요합니다.</p>
          <Link
            href="/login?next=/admin/authenticity-lab"
            className="mt-6 inline-flex rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 hover:bg-accent-hover"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">권한 없음</h1>
          <p className="text-body mt-3 text-slate-400">관리자만 접근할 수 있습니다.</p>
          <Link href="/" className="mt-6 inline-block text-accent hover:underline">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-navy-950 text-slate-100">
      <section className="page-container py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <strong>STATIC MOCKUP</strong> — 실제 검사가 아닙니다. 파일 업로드·실탐지모델·실파일 처리 없음.
            모든 입력은 사전 정의 mock 시나리오입니다.
          </div>

          <div className="mb-8">
            <p className="text-page-eyebrow text-accent">Admin · Authenticity Lab</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">UARION Authenticity Lab</h1>
            <p className="text-body mt-3 max-w-3xl text-slate-400">
              UARION 독자 Policy·FusionRisk·상태머신 기반 mock 검증 파이프라인. 외부 탐지 모델은
              확장형 인터페이스만 제공하며 현재는 mock 어댑터를 사용합니다.
            </p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {feedback}
            </div>
          )}

          <div className="home-card mb-8 p-6">
            <h2 className="text-lg font-semibold text-white">Mock 시나리오 실행</h2>
            <p className="text-body-card mt-1 text-slate-500">
              버튼만 사용 — 실제 파일 입력 없음
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={runningId !== null}
                  onClick={() => handleRun(s.id)}
                  className="rounded-lg border border-navy-700 bg-navy-800 px-4 py-3 text-left transition hover:border-accent/40 hover:bg-navy-700 disabled:opacity-60"
                >
                  <span className="font-medium text-slate-100">{s.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          {report && (
            <>
              <div className="home-card mb-6 border-accent/30 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">Mock 리포트</h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[report.status] ?? STATUS_COLORS.PENDING}`}
                  >
                    {report.status}
                  </span>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                    Trust: {report.trustTier}
                  </span>
                  <span className="text-xs text-slate-500">Fusion {report.fusionScore.toFixed(3)}</span>
                </div>
                <p className="text-body-card mt-3 text-slate-400">{report.disclaimer}</p>
                <dl className="text-body-card mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Inspection ID</dt>
                    <dd className="font-mono text-sm text-slate-300">{report.inspectionId}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Expression Safe</dt>
                    <dd className={report.expressionSafe ? "text-emerald-400" : "text-amber-400"}>
                      {report.expressionSafe ? "Yes" : "Review wording"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="home-card mb-6 p-6">
                <h3 className="text-lg font-semibold text-white">파이프라인 10단계</h3>
                <ol className="mt-4 space-y-3">
                  {LAB_PIPELINE_STEPS.map((def) => {
                    const step = stepForId(report.steps, def.id);
                    const skipped = !step;
                    return (
                      <li
                        key={def.id}
                        className={`flex items-start gap-4 rounded-lg border px-4 py-3 ${
                          skipped
                            ? "border-navy-800 bg-navy-950/50 opacity-50"
                            : step.passed
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "border-amber-500/20 bg-amber-500/5"
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-bold text-accent">
                          {def.order}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-200">{def.label}</p>
                          {skipped ? (
                            <p className="text-xs text-slate-600">건너뜀 (모달리티/조기 차단)</p>
                          ) : (
                            <>
                              <p className="text-body-card mt-1 text-slate-400">{step.message}</p>
                              {step.score !== undefined && (
                                <p className="mt-1 text-xs text-slate-500">
                                  score {step.score.toFixed(3)} · {step.durationMs}ms
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="home-card p-6">
                <h3 className="text-lg font-semibold text-white">FusionRisk 분해 (UARION)</h3>
                <dl className="text-body-card mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      ["Policy", report.fusionBreakdown.policy],
                      ["Hash", report.fusionBreakdown.hash],
                      ["Malware", report.fusionBreakdown.malware],
                      ["Image", report.fusionBreakdown.image],
                      ["Video", report.fusionBreakdown.video],
                      ["Voice", report.fusionBreakdown.voice],
                      ["Keywords", report.fusionBreakdown.keywordBoost],
                      ["Metadata", report.fusionBreakdown.metadataBoost],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2">
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="font-mono text-sm text-accent">{v.toFixed(3)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="text-body-muted mt-6 text-center text-xs text-slate-600">
                표현 원칙: 불법·가짜 확정·범죄 입증·100%·법적 증거 등 단정 표현 금지. 내부 mock 점수만 표시.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
