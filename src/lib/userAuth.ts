import { createClient } from "@supabase/supabase-js";

export type VerifiedUser = {
  id: string;
  email: string | null;
};

/** Authorization: Bearer <access_token> — 로그인 사용자 검증 (관리자 여부 무관) */
export async function verifyUserBearerToken(
  authorizationHeader: string | null,
): Promise<
  { ok: true; user: VerifiedUser } | { ok: false; status: number; message: string }
> {
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

  if (error || !data.user) {
    return { ok: false, status: 401, message: "인증에 실패했습니다." };
  }

  return {
    ok: true,
    user: { id: data.user.id, email: data.user.email ?? null },
  };
}
