import Link from "next/link";
import LegalMarkdown from "@/components/LegalMarkdown";
import { termsContent, termsVersion } from "@/content/terms";

export const metadata = {
  title: "이용약관 — UARION",
  description: "UARION 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-body mb-8 inline-block text-slate-400 transition-colors hover:text-accent"
      >
        ← 홈으로
      </Link>

      <p className="text-body-muted mb-8 text-sm text-slate-500">버전 {termsVersion}</p>

      <article className="rounded-xl border border-navy-700 bg-navy-900 p-6 sm:p-8">
        <LegalMarkdown content={termsContent} />
      </article>
    </div>
  );
}
