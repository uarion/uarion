-- ============================================================
-- UARION: products.file_path 컬럼 추가
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- Storage product-files 버킷 내 객체 경로를 저장합니다.
-- 형식: {user_id}/{product_id}/{파일명}

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS file_path text;

COMMENT ON COLUMN public.products.file_path IS
  'product-files 버킷 객체 경로 (예: user_uuid/product_uuid/file.zip). NULL = 레거시 텍스트-only 등록.';
