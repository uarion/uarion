import Link from "next/link";
import LegalMarkdown from "@/components/LegalMarkdown";
import { privacyContent, privacyVersion } from "@/content/privacy";

export const metadata = {
  title: "개인정보처리방침 — UARION",
  description: "UARION 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-body mb-8 inline-block text-slate-400 transition-colors hover:text-accent"
      >
        ← 홈으로
      </Link>

      <p className="text-body-muted mb-8 text-sm text-slate-500">버전 {privacyVersion}</p>

      <article className="rounded-xl border border-navy-700 bg-navy-900 p-6 sm:p-8">
        <LegalMarkdown content={privacyContent} />
      </article>
    </div>
  );
}
