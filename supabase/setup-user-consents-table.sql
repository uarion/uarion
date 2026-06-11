-- ============================================================
-- UARION: user_consents 테이블 (회원가입 약관·개인정보 동의 기록)
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- INSERT는 서버(service role) API 또는 auth.users 트리거.
-- 클라이언트는 본인 동의 내역 SELECT만.

CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  privacy_version text NOT NULL,
  agreed_at timestamptz NOT NULL DEFAULT now(),
  age_confirmed boolean NOT NULL DEFAULT false,
  marketing_email_agreed boolean NOT NULL DEFAULT false,
  marketing_email_agreed_at timestamptz,

  CONSTRAINT user_consents_user_id_unique UNIQUE (user_id),
  CONSTRAINT user_consents_age_confirmed_required CHECK (age_confirmed = true)
);

CREATE INDEX IF NOT EXISTS user_consents_user_id_idx ON public.user_consents (user_id);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own consents" ON public.user_consents;

CREATE POLICY "Users select own consents"
  ON public.user_consents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.user_consents IS
  '회원가입 시 이용약관·개인정보·연령 동의 기록. 쓰기는 API(service role) 또는 auth 트리거.';

-- 이메일 인증 등으로 signUp 직후 세션이 없을 때: auth.users.raw_user_meta_data → user_consents
CREATE OR REPLACE FUNCTION public.sync_user_consent_from_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'terms_version'
     AND NEW.raw_user_meta_data ? 'privacy_version' THEN
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
      COALESCE((NEW.raw_user_meta_data ->> 'marketing_email_agreed')::boolean, false),
      CASE
        WHEN COALESCE((NEW.raw_user_meta_data ->> 'marketing_email_agreed')::boolean, false)
             AND NEW.raw_user_meta_data ? 'marketing_email_agreed_at'
             AND btrim(COALESCE(NEW.raw_user_meta_data ->> 'marketing_email_agreed_at', '')) <> ''
          THEN (NEW.raw_user_meta_data ->> 'marketing_email_agreed_at')::timestamptz
        ELSE NULL
      END
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_consent ON auth.users;

CREATE TRIGGER on_auth_user_created_consent
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_consent_from_metadata();
