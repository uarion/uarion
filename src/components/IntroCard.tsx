import type { ReactNode } from "react";

type IntroCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function IntroCard({
  title,
  children,
  className = "",
}: IntroCardProps) {
  return (
    <div
      className={`rounded-xl border border-navy-700 bg-navy-900 p-6 sm:p-8 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      )}
      <div className="text-body-card">{children}</div>
    </div>
  );
}
