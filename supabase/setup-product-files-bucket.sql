-- ============================================================
-- UARION: product-files Storage 버킷 생성 (Private)
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- 실행 순서: ① 이 파일 → ② setup-product-files-storage-policies.sql
--            → ③ setup-products-file-path.sql
--
-- Private 버킷: Public URL로 직접 접근 불가.
-- 구매자 다운로드는 추후 signed URL / 결제 연동 시 service role 등으로 처리.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-files',
  'product-files',
  false,
  209715200,
  ARRAY[
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
