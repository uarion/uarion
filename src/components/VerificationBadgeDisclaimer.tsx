"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const VERIFICATION_BADGE_DISCLAIMER =
  "UARION 인증은 플랫폼 내부 기준에 따른 참고용 표시이며, 콘텐츠의 성능·적법성·보안성을 법적으로 보증하지 않습니다.";

const TOOLTIP_WIDTH_PX = 256;
const VIEWPORT_PADDING_PX = 12;

type VerificationBadgeDisclaimerProps = {
  variant: "inline" | "tooltip";
};

function VerificationBadgeTooltip() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const maxWidth = Math.min(
      TOOLTIP_WIDTH_PX,
      window.innerWidth - VIEWPORT_PADDING_PX * 2,
    );
    let left = rect.left + rect.width / 2 - maxWidth / 2;

    if (left + maxWidth > window.innerWidth - VIEWPORT_PADDING_PX) {
      left = window.innerWidth - VIEWPORT_PADDING_PX - maxWidth;
    }
    if (left < VIEWPORT_PADDING_PX) {
      left = VIEWPORT_PADDING_PX;
    }

    setPosition({
      top: rect.bottom + gap,
      left,
    });
  }, []);

  const show = useCallback(() => {
    reposition();
    setVisible(true);
  }, [reposition]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [visible, reposition]);

  const tooltip =
    visible && mounted
      ? createPortal(
          <div
            id="verification-badge-tooltip"
            role="tooltip"
            className="fixed z-[9999] rounded-lg border border-navy-700 bg-navy-950 px-3 py-2 text-left text-[11px] leading-relaxed break-words text-slate-400 shadow-lg"
            style={{
              top: position.top,
              left: position.left,
              width: Math.min(
                TOOLTIP_WIDTH_PX,
                window.innerWidth - VIEWPORT_PADDING_PX * 2,
              ),
            }}
          >
            {VERIFICATION_BADGE_DISCLAIMER}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={VERIFICATION_BADGE_DISCLAIMER}
        aria-describedby={visible ? "verification-badge-tooltip" : undefined}
        className="flex h-4 w-4 shrink-0 cursor-help items-center justify-center rounded-full border border-slate-600 text-[10px] font-semibold leading-none text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        i
      </button>
      {tooltip}
    </>
  );
}

export default function VerificationBadgeDisclaimer({
  variant,
}: VerificationBadgeDisclaimerProps) {
  if (variant === "inline") {
    return (
      <p className="text-body-muted mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
        {VERIFICATION_BADGE_DISCLAIMER}
      </p>
    );
  }

  return (
    <span className="inline-flex shrink-0 align-middle">
      <VerificationBadgeTooltip />
    </span>
  );
}
