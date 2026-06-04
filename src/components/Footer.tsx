export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-1000">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src="/logo/uarion_symbol_only.svg"
                alt=""
                aria-hidden
                className="h-9 w-auto shrink-0"
              />
              <p className="text-base font-semibold text-white">
                Uarion (유라이온)
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              AI 자동화·창작물 검증·인증 플랫폼
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-1">
            <p>
              <span className="text-slate-400">회사 소개</span> — 회사 소개
              (준비 중)
            </p>
            <p>
              <span className="text-slate-400">주소</span> — 주소: 추후 등록
            </p>
            <p>
              <span className="text-slate-400">이메일</span> —{" "}
              <span className="text-slate-200">uarion.team@gmail.com</span>
            </p>
            <p>
              <span className="text-slate-400">고객센터</span> — 고객센터: 준비
              중
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-400">
          © 2026 Uarion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
