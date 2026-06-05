/** 황금 방패 트로피 — SVG (블러 없이 선명) */
export default function GoldenTrophy({ className = "h-32 w-32 sm:h-40 sm:w-40" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="128" rx="28" ry="6" fill="rgba(251,191,36,0.35)" />
      <path d="M44 118h32v8H44z" fill="url(#gold)" />
      <path d="M38 118h44l-4 10H42l-4-10z" fill="#b45309" />
      <path
        d="M60 18l28 10v22c0 18-12 34-28 38-16-4-28-20-28-38V28l28-10z"
        fill="url(#gold)"
        stroke="#fef3c7"
        strokeWidth="1.5"
      />
      <path
        d="M60 32l-14 5v14c0 10 6 18 14 20 8-2 14-10 14-20V37l-14-5z"
        fill="#fbbf24"
      />
      <path
        d="M52 58l8 10 12-16"
        stroke="#fffbeb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 42c-6 4-10 12-8 20M102 42c6 4 10 12 8 20"
        stroke="url(#gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
