-- ============================================================
-- UARION products — 관리자 승인/거절 지원 (Phase 1A admin)
-- setup-products-table.sql 실행 후 Supabase SQL Editor에서 실행
-- ============================================================
-- 방식: 서버 API가 SUPABASE_SERVICE_ROLE_KEY로 status 변경.
--       service_role 은 RLS를 우회하고, 아래 트리거 수정으로 status 변경 허용.

CREATE OR REPLACE FUNCTION public.products_enforce_owner_and_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
    NEW.status := 'PENDING_REVIEW';
  ELSIF TG_OP = 'UPDATE' THEN
    -- 서버(service_role) 관리자 API만 status 변경 가능
    IF auth.role() = 'service_role' THEN
      NEW.updated_at := now();
      RETURN NEW;
    END IF;

    NEW.user_id := OLD.user_id;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'status cannot be changed by client';
    END IF;
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;
