export function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (normalized.includes("user already registered")) {
    return "이미 가입된 이메일입니다. 로그인해 주세요.";
  }
  if (normalized.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 받은 메일의 링크를 확인해 주세요.";
  }
  if (normalized.includes("password") && normalized.includes("6")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (normalized.includes("unable to validate email")) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }
  if (normalized.includes("signup is disabled")) {
    return "현재 회원가입이 비활성화되어 있습니다.";
  }
  if (
    normalized.includes("row-level security") ||
    normalized.includes("rls")
  ) {
    return "Storage 접근 권한이 없습니다. Supabase SQL Editor에서 avatars 버킷 정책을 설정해 주세요. (supabase/setup-storage.sql 참고)";
  }
  if (normalized.includes("bucket not found")) {
    return "Storage 버킷(avatars)이 없습니다. Supabase 대시보드에서 버킷을 생성해 주세요.";
  }

  return message;
}
