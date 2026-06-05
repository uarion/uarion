-- ============================================================
-- UARION Authenticity Lab — inspections + audit log (Phase 2)
-- setup-products-table.sql 실행 후 SQL Editor에서 실행
-- mock 검사 결과 영속화 (service_role API 전용)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id text NOT NULL UNIQUE,
  scenario_id text,
  status text NOT NULL,
  fusion_score numeric(6, 4) NOT NULL DEFAULT 0,
  trust_tier text NOT NULL DEFAULT 'unverified',
  report_json jsonb NOT NULL,
  is_mock boolean NOT NULL DEFAULT true,
  product_id uuid REFERENCES public.products (id) ON DELETE SET NULL,
  admin_email text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT inspections_status_allowed CHECK (
    status IN (
      'PENDING', 'PRE_BLOCKED', 'MALWARE_BLOCKED', 'REVIEW_REQUIRED',
      'SAFE', 'BLOCKED', 'SOURCE_DELETED', 'AUDIT_LOCKED'
    )
  )
);

CREATE INDEX IF NOT EXISTS inspections_created_at_idx ON public.inspections (created_at DESC);
CREATE INDEX IF NOT EXISTS inspections_status_idx ON public.inspections (status);

-- Append-only audit events (extracted from report audit trail)
CREATE TABLE IF NOT EXISTS public.inspection_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id text NOT NULL,
  event_at timestamptz NOT NULL,
  action text NOT NULL,
  actor text NOT NULL DEFAULT 'system',
  from_status text,
  to_status text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inspection_audit_log_inspection_id_idx
  ON public.inspection_audit_log (inspection_id);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_audit_log ENABLE ROW LEVEL SECURITY;

-- No client access — admin API uses service_role only
CREATE POLICY inspections_service_role_all ON public.inspections
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY inspection_audit_log_service_role_all ON public.inspection_audit_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);
