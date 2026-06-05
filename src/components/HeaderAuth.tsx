"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useLanguage } from "@/components/LanguageProvider";
import UserAvatar from "@/components/UserAvatar";
import { i18n } from "@/lib/i18n";
import { getDisplayEmail } from "@/lib/profile";
import { getSupabase } from "@/lib/supabaseClient";

export default function HeaderAuth() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await getSupabase().auth.getSession();
      if (mounted) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    await getSupabase().auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <span className="inline-block h-9 w-16 animate-pulse rounded bg-navy-800" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-base font-semibold text-slate-300 transition-colors hover:text-accent lg:text-lg"
      >
        {t(i18n.nav.login)}
      </Link>
    );
  }

  const email = getDisplayEmail(user);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-full transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={t(i18n.auth.accountMenu)}
      >
        <UserAvatar user={user} size="sm" />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-navy-700 bg-navy-900 py-1 shadow-lg"
        >
          <p className="border-b border-navy-700 px-4 py-3 text-xs text-slate-400">
            {email}
          </p>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-navy-800 hover:text-white"
          >
            {t(i18n.auth.profile)}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-navy-800 hover:text-white"
          >
            {t(i18n.auth.signOut)}
          </button>
        </div>
      )}
    </div>
  );
}
