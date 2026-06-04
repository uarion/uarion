import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">로그인</h1>
        <p className="mt-2 text-slate-400">
          Uarion 계정으로 로그인하세요. (현재는 UI만 제공됩니다)
        </p>
        <p className="mt-3 text-xs text-slate-500">
          유라이온은 인증된 회원만 가입할 수 있습니다 — 추후 제공
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <button
          type="button"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-navy-700 bg-navy-900 px-6 py-3 text-sm font-medium text-slate-400"
        >
          Google로 시작하기 (준비 중)
        </button>
        <button
          type="button"
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

      <form className="space-y-6 rounded-xl border border-navy-700 bg-navy-900 p-8">
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
            placeholder="you@example.com"
            className="w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          type="button"
          className="w-full cursor-not-allowed rounded-lg bg-navy-700 px-6 py-3 text-base font-semibold text-slate-400"
        >
          로그인 (준비 중)
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-accent hover:text-accent-hover">
          홈으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
