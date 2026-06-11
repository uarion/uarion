import { NextResponse } from "next/server";
import { privacyVersion } from "@/content/privacy";
import { termsVersion } from "@/content/terms";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyUserBearerToken } from "@/lib/userAuth";

type ConsentBody = {
  ageConfirmed?: boolean;
  marketingEmailAgreed?: boolean;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyUserBearerToken(request.headers.get("Authorization"));
    if (!auth.ok) {
      console.error("[consents] auth failed:", auth.status, auth.message);
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    let body: ConsentBody;
    try {
      body = (await request.json()) as ConsentBody;
    } catch {
      console.error("[consents] invalid JSON body");
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    if (!body.ageConfirmed) {
      console.error("[consents] ageConfirmed missing:", { userId: auth.user.id });
      return NextResponse.json({ error: "필수 동의 항목이 누락되었습니다." }, { status: 400 });
    }

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (err) {
      console.error("[consents] Supabase admin init failed:", err);
      return NextResponse.json(
        {
          error:
            "서버 Supabase 설정 오류입니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.",
        },
        { status: 500 },
      );
    }

    const agreedAt = new Date().toISOString();
    const marketingEmailAgreed = body.marketingEmailAgreed === true;

    const { error: insertError } = await supabase.from("user_consents").upsert(
      {
        user_id: auth.user.id,
        terms_version: termsVersion,
        privacy_version: privacyVersion,
        agreed_at: agreedAt,
        age_confirmed: true,
        marketing_email_agreed: marketingEmailAgreed,
        marketing_email_agreed_at: marketingEmailAgreed ? agreedAt : null,
      },
      { onConflict: "user_id" },
    );

    if (insertError) {
      console.error("[consents] insert failed:", {
        userId: auth.user.id,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
      return NextResponse.json(
        { error: insertError.message || "동의 기록 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      termsVersion,
      privacyVersion,
      agreedAt,
      marketingEmailAgreed,
      marketingEmailAgreedAt: marketingEmailAgreed ? agreedAt : null,
    });
  } catch (err) {
    console.error("[consents] unhandled error:", err);
    return NextResponse.json({ error: "동의 기록 처리 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
