-- ============================================================
-- UARION: product-files Storage RLS 정책 (Private)
-- Supabase Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- 사전 준비: setup-product-files-bucket.sql 실행 완료
--
-- 객체 경로 규칙: {user_id}/{product_id}/{파일명}
-- 예: a1b2c3d4-.../e5f6g7h8-.../my-workflow.zip

DROP POLICY IF EXISTS "Sellers read own product files" ON storage.objects;
DROP POLICY IF EXISTS "Sellers upload own product files" ON storage.objects;
DROP POLICY IF EXISTS "Sellers update own product files" ON storage.objects;
DROP POLICY IF EXISTS "Sellers delete own product files" ON storage.objects;

-- 판매자: 자신의 user_id 폴더 아래 파일만 읽기 (Private — signed URL/서버 경유 전까지)
CREATE POLICY "Sellers read own product files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 판매자: 자신의 user_id 폴더에만 업로드
CREATE POLICY "Sellers upload own product files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 덮어쓰기(upsert)용 UPDATE
CREATE POLICY "Sellers update own product files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'product-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 업로드 실패 시 정리·재등록용 DELETE
CREATE POLICY "Sellers delete own product files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
