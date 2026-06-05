import type { ReactNode } from "react";

function IconWrap({ children, glow = "cyan" }: { children: ReactNode; glow?: "cyan" | "violet" }) {
  const ring = glow === "violet" ? "ring-violet-500/50" : "ring-[#0085FF]/50";
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c1528] ring-1 ${ring}`}
    >
      {children}
    </div>
  );
}

export function FounderIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const stroke = "currentColor";
  const icons: Record<string, ReactNode> = {
    cube: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 3v9M12 12l8 4.5M12 12L4 16.5" />
      </svg>
    ),
    users: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.2 1.8-4 4-4" strokeLinecap="round" />
      </svg>
    ),
    rocket: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M12 2c2 4 2 8 0 12-2-4-2-8 0-12z" />
        <path d="M9 14l-3 3M15 14l3 3M12 14v6" strokeLinecap="round" />
      </svg>
    ),
    shield: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
    percent: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M19 5L5 19" strokeLinecap="round" />
      </svg>
    ),
    star: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M12 2l2.9 6.9H22l-5.5 4 2.1 6.9L12 17.5 5.4 19.8l2.1-6.9L2 8.9h7.1L12 2z" />
      </svg>
    ),
    crown: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M4 18h16M6 18l2-8 4 4 4-4 2 8" strokeLinejoin="round" />
        <path d="M8 10l2-4 2 4 2-4 2 4" strokeLinecap="round" />
      </svg>
    ),
    cart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
        <path d="M2 4h2l2.5 12h11l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    growth: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21v-1a7 7 0 0114 0v1" />
        <path d="M16 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    hex: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
      </svg>
    ),
    bell: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden>
        <path d="M15 17H9l-1-2v-4a5 5 0 0110 0v4l-1 2z" />
        <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
      </svg>
    ),
  };
  return <span className="text-[#0085FF]">{icons[name] ?? icons.cube}</span>;
}

export function GlowingStatIcon({ name }: { name: string }) {
  return (
    <IconWrap glow="cyan">
      <FounderIcon name={name} />
    </IconWrap>
  );
}

export function ServiceIconBox({ name }: { name: string }) {
  return (
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0085FF]/30 bg-[#0085FF]/15 lg:h-16 lg:w-16">
      <FounderIcon name={name} className="h-7 w-7 text-[#0085FF] lg:h-8 lg:w-8" />
    </div>
  );
}

export function CtaCircleIcon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <IconWrap glow={name === "shield" ? "violet" : "cyan"}>
        <FounderIcon name={name} className="h-5 w-5" />
      </IconWrap>
    </div>
  );
}
