import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export const AVATAR_BUCKET = "avatars";
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const ALLOWED_AVATAR_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_AVATAR_EXT = new Set(["jpg", "jpeg", "png", "webp"]);

export type UserProfileMetadata = {
  avatar_url?: string;
  nickname?: string;
};

/** 닉네임·아바타 URL은 Auth user metadata에만 저장합니다 (profiles 테이블 미사용). */
export function getDisplayEmail(user: User | null): string {
  return user?.email ?? "";
}

export function getAvatarUrl(user: User | null): string | undefined {
  const meta = user?.user_metadata as UserProfileMetadata | undefined;
  return meta?.avatar_url;
}

export function getNickname(user: User | null): string {
  const meta = user?.user_metadata as UserProfileMetadata | undefined;
  return meta?.nickname ?? "";
}

export function getEmailInitial(email: string): string {
  const char = email.trim().charAt(0);
  return char ? char.toUpperCase() : "?";
}

export function validateAvatarFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_AVATAR_MIME.has(file.type) && !ALLOWED_AVATAR_EXT.has(ext)) {
    return "jpg, png, webp 형식만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return "이미지는 5MB 이하만 가능합니다.";
  }
  return null;
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  const path = `${userId}/avatar.${normalizedExt}`;

  // upsert INSERT 시 RLS 충돌을 줄이기 위해 기존 파일을 먼저 삭제
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || `image/${normalizedExt === "jpg" ? "jpeg" : normalizedExt}`,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function updateProfileMetadata(
  patch: Partial<UserProfileMetadata>,
): Promise<User> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const current = (user.user_metadata ?? {}) as UserProfileMetadata;
  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...current,
      ...patch,
    },
  });

  if (error) {
    throw error;
  }
  if (!data.user) {
    throw new Error("프로필 저장에 실패했습니다.");
  }

  return data.user;
}
