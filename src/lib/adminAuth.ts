import { createClient } from "@supabase/supabase-js";

/** 서버 전용 — 관리자 이메일 (NEXT_PUBLIC_ 사용 금지) */
export function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  if (!email) {
    throw new Error("ADMIN_EMAIL is not configured.");
  }
  return email;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  try {
    return email.trim().toLowerCase() === getAdminEmail();
  } catch {
    return false;
  }
}

/** Authorization: Bearer <access_token> — 서버에서 세션·관리자 이메일 검증 */
export async function verifyAdminBearerToken(
  authorizationHeader: string | null,
): Promise<{ ok: true; email: string } | { ok: false; status: number; message: string }> {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "로그인이 필요합니다." };
  }

  const token = authorizationHeader.slice(7).trim();
  if (!token) {
    return { ok: false, status: 401, message: "유효하지 않은 인증 토큰입니다." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, message: "Supabase 설정이 없습니다." };
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) {
    return { ok: false, status: 401, message: "인증에 실패했습니다." };
  }

  if (!isAdminEmail(data.user.email)) {
    return { ok: false, status: 403, message: "관리자 권한이 없습니다." };
  }

  return { ok: true, email: data.user.email };
}
