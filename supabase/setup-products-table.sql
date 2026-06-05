-- ============================================================
-- UARION products 테이블 (Phase 1A — 텍스트 등록만)
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT products_price_range CHECK (price >= 0 AND price <= 10000000),
  CONSTRAINT products_title_length CHECK (
    char_length(trim(title)) > 0 AND char_length(title) <= 100
  ),
  CONSTRAINT products_description_length CHECK (char_length(description) <= 5000),
  CONSTRAINT products_category_allowed CHECK (
    category IN (
      '프롬프트',
      '플레이북',
      '워크플로우',
      'SVG에셋',
      '자동화설계',
      '설치가이드'
    )
  ),
  CONSTRAINT products_status_allowed CHECK (
    status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'BLOCKED')
  )
);

CREATE INDEX IF NOT EXISTS products_user_id_idx ON public.products (user_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);

-- INSERT 시 user_id·status는 auth.uid() / PENDING_REVIEW 로 서버 고정 (클라이언트 값 무시)
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
    NEW.user_id := OLD.user_id;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'status cannot be changed by client';
    END IF;
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_enforce_owner_and_status ON public.products;
CREATE TRIGGER products_enforce_owner_and_status
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.products_enforce_owner_and_status();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own products" ON public.products;
DROP POLICY IF EXISTS "Anyone select approved products" ON public.products;
DROP POLICY IF EXISTS "Users insert own products" ON public.products;
DROP POLICY IF EXISTS "Users update own products" ON public.products;

CREATE POLICY "Users select own products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone select approved products"
  ON public.products
  FOR SELECT
  USING (status = 'APPROVED');

CREATE POLICY "Users insert own products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users update own products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
