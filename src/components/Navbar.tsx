import Link from "next/link";

const navLinks = [
  { href: "/products", label: "등록물" },
  { href: "/sell", label: "등록·검증" },
  { href: "/login", label: "로그인" },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-navy-1000 shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
      <nav className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img
            src="/logo/uarion_symbol_only.svg"
            alt=""
            aria-hidden
            className="h-[72px] w-auto shrink-0"
          />
          <span className="text-2xl font-semibold tracking-tight text-white">
            Uarion
          </span>
        </Link>
        <ul className="flex items-center gap-6 sm:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
