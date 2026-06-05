-- ============================================================
-- Uarion: Supabase Storage (avatars) RLS 정책
-- Supabase 대시보드 → SQL Editor → New query → 붙여넣기 → Run
-- ============================================================
-- 사전 준비: Storage에서 버킷 이름 "avatars" 생성, Public bucket 체크
--
-- 앱은 닉네임·avatar_url을 profiles 테이블이 아니라
-- Auth user metadata (supabase.auth.updateUser)에 저장합니다.
-- RLS 오류는 대부분 Storage 업로드(INSERT) 정책 부재 때문입니다.

-- 기존 정책 이름이 겹치면 DROP 후 다시 실행하세요.
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;

-- 누구나 아바타 이미지 읽기 (Public 버킷 + 헤더 표시용)
CREATE POLICY "Public read avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 로그인 사용자: 자신의 UUID 폴더에만 업로드
CREATE POLICY "Users upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 덮어쓰기(upsert)용 UPDATE
CREATE POLICY "Users update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 재업로드 전 삭제
CREATE POLICY "Users delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
