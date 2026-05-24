import React from "react";

export function EmptyIllustration() {
  return (
    <svg
      width="260"
      height="220"
      viewBox="0 0 260 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[220px] h-auto sm:w-[260px]"
    >
      {/* ── Large background circle ── */}
      <circle cx="128" cy="118" r="82" fill="#E8E8EC" />

      {/* ── Squiggly doodle top-left ── */}
      <path
        d="M42 62 C46 54, 52 70, 58 62 C64 54, 70 68, 74 58"
        stroke="#1A1A2E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Sparkle / 4-point star bottom-left ── */}
      <g transform="translate(56, 158)">
        <path d="M0 -9 L1.5 -1.5 L9 0 L1.5 1.5 L0 9 L-1.5 1.5 L-9 0 L-1.5 -1.5 Z"
          fill="#5B8DEF" />
      </g>

      {/* ── Blue dot right ── */}
      <circle cx="214" cy="130" r="5.5" fill="#4A6FA5" />

      {/* ── Floating card top-right ── */}
      <rect x="172" y="52" width="62" height="28" rx="6" fill="white" />
      <rect x="182" y="61" width="18" height="4" rx="2" fill="#D1D5DB" />
      <rect x="182" y="69" width="12" height="4" rx="2" fill="#E5E7EB" />
      <circle cx="208" cy="63" r="4" fill="#E5E7EB" />

      {/* ── Document (white page) ── */}
      <rect x="92" y="58" width="82" height="102" rx="8" fill="white" />
      {/* Top dark bar on doc */}
      <rect x="108" y="70" width="48" height="6" rx="3" fill="#1A1A2E" />
      {/* Doc lines */}
      <rect x="108" y="84" width="52" height="4" rx="2" fill="#E5E7EB" />
      <rect x="108" y="94" width="44" height="4" rx="2" fill="#E5E7EB" />
      <rect x="108" y="104" width="48" height="4" rx="2" fill="#E5E7EB" />
      <rect x="108" y="114" width="36" height="4" rx="2" fill="#E5E7EB" />
      <rect x="108" y="124" width="44" height="4" rx="2" fill="#E5E7EB" />
      <rect x="108" y="134" width="40" height="4" rx="2" fill="#E5E7EB" />

      {/* ── Magnifying glass circle ── */}
      <circle cx="148" cy="140" r="36" fill="#C8C5D8" fillOpacity="0.55" />
      <circle cx="148" cy="140" r="32" fill="white" fillOpacity="0.9" />

      {/* ── Red × inside magnifier ── */}
      <path
        d="M136 128 L160 152"
        stroke="#EF4444"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M160 128 L136 152"
        stroke="#EF4444"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* ── Magnifier handle ── */}
      <line
        x1="172"
        y1="164"
        x2="188"
        y2="180"
        stroke="#9CA3AF"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* ── Magnifier ring ── */}
      <circle
        cx="148"
        cy="140"
        r="32"
        stroke="#B8B5CC"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );
}
