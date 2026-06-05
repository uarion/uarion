-- ============================================================
-- [선택] profiles 테이블을 따로 쓰는 경우에만 실행
-- 현재 Uarion 앱은 이 테이블을 사용하지 않습니다.
-- Auth user metadata (nickname, avatar_url)만 사용합니다.
-- ============================================================
-- 트리거로 profiles에 INSERT할 때 RLS 오류가 난다면 아래 정책을 추가하세요.

-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   nickname text,
--   avatar_url text,
--   updated_at timestamptz DEFAULT now()
-- );

-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Users select own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- CREATE POLICY "Users select own profile"
-- ON public.profiles FOR SELECT TO authenticated
-- USING (auth.uid() = id);

-- CREATE POLICY "Users insert own profile"
-- ON public.profiles FOR INSERT TO authenticated
-- WITH CHECK (auth.uid() = id);

-- CREATE POLICY "Users update own profile"
-- ON public.profiles FOR UPDATE TO authenticated
-- USING (auth.uid() = id)
-- WITH CHECK (auth.uid() = id);
