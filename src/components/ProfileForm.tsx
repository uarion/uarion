"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import UserAvatar from "@/components/UserAvatar";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  getDisplayEmail,
  getNickname,
  updateProfileMetadata,
  uploadAvatar,
  validateAvatarFile,
} from "@/lib/profile";
import { getSupabase } from "@/lib/supabaseClient";

export default function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingNickname, setSavingNickname] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await getSupabase().auth.getSession();
      if (!mounted) return;

      if (!data.session?.user) {
        router.replace("/login");
        return;
      }

      setUser(data.session.user);
      setNickname(getNickname(data.session.user));
      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setUser(session.user);
      setNickname(getNickname(session.user));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setFeedback({ type: "error", text: validationError });
      return;
    }

    setUploadingAvatar(true);
    setFeedback(null);

    try {
      const avatarUrl = await uploadAvatar(user.id, file);
      const updatedUser = await updateProfileMetadata({ avatar_url: avatarUrl });
      setUser(updatedUser);
      router.push("/");
      return;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      setFeedback({
        type: "error",
        text: getAuthErrorMessage(message),
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleNicknameSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSavingNickname(true);
    setFeedback(null);

    try {
      const updatedUser = await updateProfileMetadata({
        nickname: nickname.trim(),
      });
      setUser(updatedUser);
      setNickname(getNickname(updatedUser));
      router.push("/");
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : "저장에 실패했습니다.";
      setFeedback({ type: "error", text: getAuthErrorMessage(message) });
    } finally {
      setSavingNickname(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md animate-pulse space-y-6 px-4 py-12">
        <div className="mx-auto h-24 w-24 rounded-full bg-navy-800" />
        <div className="h-10 rounded-lg bg-navy-800" />
        <div className="h-10 rounded-lg bg-navy-800" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const email = getDisplayEmail(user);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-white">내 정보</h1>
      <p className="mb-6 text-xs text-slate-500">
        닉네임·프로필 이미지 URL은 Supabase Auth 사용자 metadata에 저장됩니다.
      </p>

      {feedback && (
        <p
          role="alert"
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border border-red-500/30 bg-red-500/10 text-red-200"
              : "border border-accent/30 bg-accent/10 text-accent"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-navy-700 bg-navy-900 p-8">
        <UserAvatar user={user} size="lg" />
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <button
          type="button"
          disabled={uploadingAvatar}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-accent/40 hover:text-white disabled:opacity-60"
        >
          {uploadingAvatar ? "업로드 중..." : "이미지 변경"}
        </button>
        <p className="text-center text-xs text-slate-500">
          jpg · png · webp, 최대 5MB
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-navy-700 bg-navy-900 p-8">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            readOnly
            value={email}
            className="w-full cursor-not-allowed rounded-lg border border-navy-700 bg-navy-800/80 px-4 py-2.5 text-slate-400"
          />
        </div>

        <form onSubmit={handleNicknameSave}>
          <label
            htmlFor="nickname"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            닉네임 <span className="text-slate-500">(선택)</span>
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="표시 이름"
            maxLength={30}
            className="mb-4 w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={savingNickname}
            className="w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-navy-950 transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {savingNickname ? "저장 중..." : "닉네임 저장"}
          </button>
        </form>
      </div>
    </div>
  );
}
