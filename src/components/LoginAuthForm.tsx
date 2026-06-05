"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup";

const inputClassName =
  "w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function LoginAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setFeedback(null);
    setConfirmPassword("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
      setFeedback({
        type: "error",
        text: "Supabase URL이 설정되지 않았습니다. .env.local을 확인해 주세요.",
      });
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) {
      setFeedback({
        type: "error",
        text: "Supabase 키가 설정되지 않았습니다. .env.local을 확인해 주세요.",
      });
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFeedback({ type: "error", text: "이메일을 입력해 주세요." });
      return;
    }

    if (password.length < 6) {
      setFeedback({
        type: "error",
        text: "비밀번호는 6자 이상이어야 합니다.",
      });
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setFeedback({
        type: "error",
        text: "비밀번호 확인이 일치하지 않습니다.",
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setFeedback({
            type: "error",
            text: getAuthErrorMessage(error.message),
          });
          return;
        }

        if (data.session) {
          router.push("/");
          router.refresh();
          return;
        }

        setFeedback({
          type: "success",
          text: "회원가입이 완료되었습니다. 이메일로 보낸 인증 링크를 확인한 뒤 로그인해 주세요.",
        });
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setFeedback({
          type: "error",
          text: getAuthErrorMessage(error.message),
        });
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex rounded-lg border border-navy-700 bg-navy-900 p-1">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-navy-700 text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-navy-700 text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          회원가입
        </button>
      </div>

      <div className="mb-6 space-y-3">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-navy-700 bg-navy-900 px-6 py-3 text-sm font-medium text-slate-400"
        >
          Google로 시작하기 (준비 중)
        </button>
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-navy-700 bg-navy-900 px-6 py-3 text-sm font-medium text-slate-400"
        >
          카카오로 시작하기 (준비 중)
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-navy-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-navy-950 px-2 text-slate-500">또는 이메일로</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-navy-700 bg-navy-900 p-8"
      >
        {feedback && (
          <p
            role="alert"
            className={`rounded-lg px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border border-red-500/30 bg-red-500/10 text-red-200"
                : "border border-accent/30 bg-accent/10 text-accent"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            className={inputClassName}
          />
        </div>

        {mode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력"
              className={inputClassName}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "처리 중..."
            : mode === "login"
              ? "로그인"
              : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-accent hover:text-accent-hover">
          홈으로 돌아가기
        </Link>
      </p>
    </>
  );
}
