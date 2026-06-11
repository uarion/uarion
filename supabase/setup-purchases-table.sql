-- ============================================================
-- UARION: purchases 테이블 (결제·구매 기록)
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- INSERT/UPDATE는 서버(service role)만 수행. 클라이언트는 본인 구매 SELECT만.

CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  amount integer NOT NULL,
  order_id text NOT NULL,
  payment_key text,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT purchases_amount_positive CHECK (amount >= 0),
  CONSTRAINT purchases_status_allowed CHECK (
    status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')
  ),
  CONSTRAINT purchases_order_id_unique UNIQUE (order_id)
);

CREATE INDEX IF NOT EXISTS purchases_buyer_id_idx ON public.purchases (buyer_id);
CREATE INDEX IF NOT EXISTS purchases_product_id_idx ON public.purchases (product_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON public.purchases (status);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers select own purchases" ON public.purchases;

CREATE POLICY "Buyers select own purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

COMMENT ON TABLE public.purchases IS
  '구매·결제 기록. PENDING=결제창 오픈 전, PAID=승인 완료. 쓰기는 API(service role) 전용.';
