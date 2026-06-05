"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import {
  fetchLabHistory,
  fetchLabPolicy,
  fetchLabScenarios,
  runLabCustomMock,
  runLabScenario,
} from "@/lib/authenticity-lab-client";
import { MOCK_SAFE_IMAGE } from "@/lib/authenticity-lab/mock/fixtures";
import { LAB_PIPELINE_STEPS } from "@/lib/authenticity-lab/pipeline/steps";
import type { InspectionReport, PipelineStepId, StepResult } from "@/lib/authenticity-lab/types";
import type { LabScenario } from "@/lib/authenticity-lab/scenarios";
import type { TrustSignal } from "@/lib/authenticity-lab/trust-flow";
import type { InspectionRow } from "@/lib/inspections-admin";

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

const TRUST_LEVEL_COLORS: Record<TrustSignal["level"], string> = {
  blocked: "text-red-400 border-red-500/30 bg-red-500/10",
  restricted: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  review: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  caution: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  cleared_mock: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

type PolicySummary = {
  version: string;
  fusion_weights: Record<string, number>;
  risk_threshold: Record<string, number>;
  review_rules: Record<string, unknown>;
  blocked_hashes_count?: number;
};

type ReviewQueueSnapshot = { pending: number; items: unknown[] };

function stepForId(steps: StepResult[], id: PipelineStepId): StepResult | undefined {
  return steps.find((s) => s.stepId === id);
}

const DEFAULT_CUSTOM_JSON = JSON.stringify(MOCK_SAFE_IMAGE, null, 2);

export default function AdminAuthenticityLabPageClient() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [scenarios, setScenarios] = useState<LabScenario[]>([]);
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [trustSignals, setTrustSignals] = useState<TrustSignal[] | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);
  const [persistedId, setPersistedId] = useState<string | null>(null);
  const [adapterKind, setAdapterKind] = useState<"mock" | "stub_external">("mock");
  const [policy, setPolicy] = useState<PolicySummary | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueSnapshot | null>(null);
  const [history, setHistory] = useState<InspectionRow[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [customJson, setCustomJson] = useState(DEFAULT_CUSTOM_JSON);
  const [csamTestActive, setCsamTestActive] = useState(false);

  const loadPolicy = useCallback(async (token: string) => {
    const result = await fetchLabPolicy(token);
    if (!result.forbidden && !result.error) {
      setPolicy(result.policy);
      setReviewQueue(result.reviewQueue);
    }
  }, []);

  const loadHistory = useCallback(async (token: string) => {
    const result = await fetchLabHistory(token);
    if (result.forbidden) return;
    if (result.error) {
      setHistoryError(result.error);
      setHistory([]);
    } else {
      setHistoryError(null);
      setHistory(result.rows);
    }
  }, []);

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

  const refreshSidePanels = useCallback(
    async (token: string) => {
      await Promise.all([loadPolicy(token), loadHistory(token)]);
    },
    [loadPolicy, loadHistory],
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await getSupabase().auth.getSession();
      if (!mounted) return;
      const token = data.session?.access_token ?? null;
      setAccessToken(token);
      setAuthLoading(false);
      if (token) {
        await loadScenarios(token);
        await refreshSidePanels(token);
      }
    }

    init();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
      const token = session?.access_token ?? null;
      setAccessToken(token);
      if (token) {
        await loadScenarios(token);
        await refreshSidePanels(token);
      } else {
        setScenarios([]);
        setForbidden(false);
        setReport(null);
        setTrustSignals(null);
        setPolicy(null);
        setHistory([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadScenarios, refreshSidePanels]);

  function applyRunResult(result: {
    report: InspectionReport | null;
    trustSignals: TrustSignal[] | null;
    persistedId: string | null;
    persistWarning: string | null;
    reviewQueue?: ReviewQueueSnapshot | null;
    error: string | null;
    forbidden: boolean;
  }) {
    if (result.forbidden) {
      setForbidden(true);
      return;
    }
    if (result.error) {
      setFeedback(result.error);
      return;
    }
    setReport(result.report);
    setTrustSignals(result.trustSignals);
    setPersistedId(result.persistedId);
    setPersistWarning(result.persistWarning);
    if (result.reviewQueue) setReviewQueue(result.reviewQueue);
  }

  async function handleRun(scenarioId: string) {
    if (!accessToken) return;
    setRunningId(scenarioId);
    setFeedback(null);
    setPersistWarning(null);
    setCsamTestActive(scenarioId === "csam_branch");
    const result = await runLabScenario(scenarioId, accessToken, {
      detectionAdapterKind: adapterKind,
    });
    setRunningId(null);
    applyRunResult(result);
    if (!result.error && !result.forbidden && accessToken) {
      await refreshSidePanels(accessToken);
    }
  }

  async function handleRunCustom() {
    if (!accessToken) return;
    setRunningId("custom");
    setFeedback(null);
    setPersistWarning(null);
    setCsamTestActive(false);
    let parsed: unknown;
    try {
      parsed = JSON.parse(customJson);
    } catch {
      setRunningId(null);
      setFeedback("Custom JSON 파싱 실패 — 유효한 JSON을 입력하세요.");
      return;
    }
    const result = await runLabCustomMock(parsed, accessToken, {
      detectionAdapterKind: adapterKind,
    });
    setRunningId(null);
    applyRunResult(result);
    if (!result.error && !result.forbidden && accessToken) {
      await refreshSidePanels(accessToken);
    }
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
            모든 입력은 사전 정의 mock 시나리오 또는 JSON descriptor입니다.
          </div>

          {csamTestActive && (
            <div className="mb-6 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 text-sm text-purple-200">
              <strong>CSAM 테스트 모드</strong> — 테스트 전용 policy override (
              <code className="text-xs">MOCK_BLOCKED_HASH_001</code>)가 자동 주입됩니다. 운영 policy의{" "}
              <code className="text-xs">blocked_hashes</code>는 빈 목록 유지.
            </div>
          )}

          <div className="mb-8">
            <p className="text-page-eyebrow text-accent">Admin · Authenticity Lab</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">UARION Authenticity Lab</h1>
            <p className="text-body mt-3 max-w-3xl text-slate-400">
              UARION 독자 Policy·FusionRisk·상태머신 기반 mock 검증 파이프라인. DetectionEngine은 mock /
              stub_external 어댑터를 선택할 수 있습니다.
            </p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {feedback}
            </div>
          )}

          {persistWarning && (
            <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              <strong>영속화 경고:</strong> {persistWarning}
              <p className="mt-1 text-xs text-amber-300/80">
                Supabase SQL Editor에서 <code>supabase/setup-inspections-table.sql</code> 실행 후 재시도.
              </p>
            </div>
          )}

          {persistedId && (
            <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              검사 결과 저장됨 — DB id: <span className="font-mono">{persistedId}</span>
            </div>
          )}

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <div className="home-card p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white">Policy & Fusion 가중치</h2>
              {policy ? (
                <dl className="text-body-card mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-slate-500">Version</dt>
                    <dd className="font-mono text-sm text-accent">{policy.version}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">blocked_hashes (운영)</dt>
                    <dd className="text-sm text-slate-300">{policy.blocked_hashes_count ?? 0}</dd>
                  </div>
                  {Object.entries(policy.fusion_weights).map(([k, v]) => (
                    <div key={k} className="rounded border border-navy-700 bg-navy-800/50 px-2 py-1">
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="font-mono text-sm text-accent">{v.toFixed(2)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-body-card mt-2 text-slate-500">로딩 중…</p>
              )}
            </div>

            <div className="home-card p-6">
              <h2 className="text-lg font-semibold text-white">Human Review 큐</h2>
              <p className="text-body-card mt-2 text-slate-400">
                대기 <span className="font-mono text-accent">{reviewQueue?.pending ?? 0}</span>건 (in-memory
                mock)
              </p>
              {reviewQueue && reviewQueue.items.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-slate-500">
                  {reviewQueue.items.slice(-3).map((item, i) => (
                    <li key={i} className="truncate font-mono">
                      {JSON.stringify(item)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="home-card mb-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Detection 어댑터</h2>
                <p className="text-body-card mt-1 text-slate-500">실제 모델 연결 없음 — mock / stub만</p>
              </div>
              <select
                value={adapterKind}
                onChange={(e) => setAdapterKind(e.target.value as "mock" | "stub_external")}
                className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-slate-200"
              >
                <option value="mock">mock</option>
                <option value="stub_external">stub_external</option>
              </select>
            </div>
          </div>

          <div className="home-card mb-8 p-6">
            <h2 className="text-lg font-semibold text-white">Mock 시나리오 실행</h2>
            <p className="text-body-card mt-1 text-slate-500">버튼만 사용 — 실제 파일 입력 없음</p>
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
                  {s.id === "csam_branch" && (
                    <span className="mt-1 block text-xs text-purple-400">테스트 policy override 자동</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="home-card mb-8 p-6">
            <h2 className="text-lg font-semibold text-white">Custom Mock JSON</h2>
            <p className="text-body-card mt-1 text-slate-500">
              MockFileDescriptor JSON만 허용 — 파일 업로드 없음
            </p>
            <textarea
              value={customJson}
              onChange={(e) => setCustomJson(e.target.value)}
              rows={8}
              className="mt-4 w-full rounded-lg border border-navy-700 bg-navy-950 p-3 font-mono text-xs text-slate-300"
              spellCheck={false}
            />
            <button
              type="button"
              disabled={runningId !== null}
              onClick={handleRunCustom}
              className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-accent-hover disabled:opacity-60"
            >
              {runningId === "custom" ? "실행 중…" : "Custom JSON 실행"}
            </button>
          </div>

          {trustSignals && trustSignals.length > 0 && (
            <div className="home-card mb-8 p-6">
              <h2 className="text-lg font-semibold text-white">신뢰 흐름 (Market / Registry / Certification)</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {trustSignals.map((s) => (
                  <div
                    key={s.surface}
                    className={`rounded-lg border px-4 py-3 ${TRUST_LEVEL_COLORS[s.level]}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">{s.surface}</p>
                    <p className="mt-1 text-sm">{s.message}</p>
                    <p className="mt-2 text-xs opacity-70">{s.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div className="home-card mt-8 p-6">
            <h2 className="text-lg font-semibold text-white">검사 이력 (Supabase)</h2>
            {historyError ? (
              <p className="text-body-card mt-2 text-amber-400">{historyError}</p>
            ) : history.length === 0 ? (
              <p className="text-body-card mt-2 text-slate-500">저장된 이력 없음</p>
            ) : (
              <ul className="mt-4 divide-y divide-navy-800">
                {history.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                    <span className="font-mono text-xs text-slate-500">{row.inspection_id}</span>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs ${STATUS_COLORS[row.status] ?? ""}`}
                    >
                      {row.status}
                    </span>
                    <span className="text-slate-400">{row.scenario_id ?? "custom"}</span>
                    <span className="text-xs text-slate-500">fusion {row.fusion_score.toFixed(3)}</span>
                    <span className="text-xs text-slate-600">
                      {new Date(row.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
