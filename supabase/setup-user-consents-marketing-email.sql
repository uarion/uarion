-- ============================================================
-- UARION: user_consents 마케팅 이메일 수신 동의 컬럼 추가
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- 사전 준비: setup-user-consents-table.sql 실행 완료

ALTER TABLE public.user_consents
ADD COLUMN IF NOT EXISTS marketing_email_agreed boolean NOT NULL DEFAULT false;

ALTER TABLE public.user_consents
ADD COLUMN IF NOT EXISTS marketing_email_agreed_at timestamptz;

COMMENT ON COLUMN public.user_consents.marketing_email_agreed IS
  '이메일 광고성 정보(마케팅) 수신 동의 여부. 선택 항목.';
COMMENT ON COLUMN public.user_consents.marketing_email_agreed_at IS
  '마케팅 이메일 수신 동의 일시. 미동의 시 NULL.';

CREATE OR REPLACE FUNCTION public.sync_user_consent_from_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  marketing_agreed boolean;
  marketing_agreed_at timestamptz;
BEGIN
  IF NEW.raw_user_meta_data ? 'terms_version'
     AND NEW.raw_user_meta_data ? 'privacy_version' THEN
    marketing_agreed := COALESCE(
      (NEW.raw_user_meta_data ->> 'marketing_email_agreed')::boolean,
      false
    );

    IF marketing_agreed
       AND NEW.raw_user_meta_data ? 'marketing_email_agreed_at'
       AND (NEW.raw_user_meta_data ->> 'marketing_email_agreed_at') IS NOT NULL
       AND btrim(NEW.raw_user_meta_data ->> 'marketing_email_agreed_at') <> '' THEN
      marketing_agreed_at := (NEW.raw_user_meta_data ->> 'marketing_email_agreed_at')::timestamptz;
    ELSE
      marketing_agreed_at := NULL;
    END IF;

    INSERT INTO public.user_consents (
      user_id,
      terms_version,
      privacy_version,
      agreed_at,
      age_confirmed,
      marketing_email_agreed,
      marketing_email_agreed_at
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'terms_version',
      NEW.raw_user_meta_data ->> 'privacy_version',
      COALESCE(
        (NEW.raw_user_meta_data ->> 'agreed_at')::timestamptz,
        now()
      ),
      COALESCE((NEW.raw_user_meta_data ->> 'age_confirmed')::boolean, false),
      marketing_agreed,
      marketing_agreed_at
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
