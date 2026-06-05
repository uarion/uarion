import { getAvatarUrl, getEmailInitial, getDisplayEmail } from "@/lib/profile";
import type { User } from "@supabase/supabase-js";

type UserAvatarProps = {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
};

export default function UserAvatar({
  user,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const avatarUrl = getAvatarUrl(user);
  const email = getDisplayEmail(user);
  const initial = getEmailInitial(email);
  const sizeClass = sizeClasses[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`shrink-0 rounded-full object-cover ring-2 ring-navy-700 ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-navy-800 font-semibold text-accent ring-2 ring-navy-700 ${sizeClass} ${className}`}
      aria-hidden
    >
      {initial}
    </span>
  );
}
