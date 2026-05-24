"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Wand2,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home",               icon: LayoutGrid, href: "/"           },
  { label: "My Groups",          icon: Users,      href: "/groups"     },
  { label: "Assignments",        icon: FileText,   href: "/assignments" },
  { label: "AI Teacher's Toolkit", icon: Wand2,   href: "/toolkit"    },
  { label: "My Library",         icon: BookOpen,   href: "/library", badge: "32" },
];

interface SidebarProps {
  ctaLabel?: string;
  ctaHref?: string;
  activeHref?: string;
}

export function Sidebar({
  ctaLabel = "Create Assignment",
  ctaHref = "/create",
  activeHref,
}: SidebarProps) {
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname;

  return (
    <aside
      className="hidden md:flex"
      style={{
        position: "fixed",
        top: "12px",
        left: "12px",
        bottom: "12px",
        width: "304px",
        borderRadius: "16px",
        padding: "24px",
        background: "#FFFFFF",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
        boxShadow:
          "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
      }}
    >

      {/* ══════════════════════════════════════
          TOP SECTION — logo + CTA + nav
      ══════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          width: "251px",
        }}
      >

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* Logo mark — 48×48 so the actual icon is clearly visible */}
          <img
            src="/logo-mobile.png"
            alt="VedaAI logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "15px",
              flexShrink: 0,
              display: "block",
              objectFit: "cover",
            }}
          />

          {/* VedaAI wordmark */}
          <span
            style={{
              fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: "28px",
              letterSpacing: "-0.06em",
              color: "#303030",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            VedaAI
          </span>
        </div>

        {/* Create button + Nav grouped together with 8px gap */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>

          {/* Create Assignment button — gradient border + deep shadows */}
          <Link
            href={ctaHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "251px",
              height: "42px",
              borderRadius: "100px",
              padding: "8px 43px",
              /* Gradient border technique:
                 First bg = solid fill for the button face,
                 Second bg = gradient that shows through the transparent border */
              border: "4px solid transparent",
              backgroundImage:
                "linear-gradient(#272727, #272727), linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow:
                "0px 32px 48px rgba(255,255,255,0.2), " +
                "0px 16px 48px rgba(255,255,255,0.12), " +
                "inset 0px 0px 34.5px rgba(255,255,255,0.25), " +
                "inset 0px -1px 3.5px rgba(177,177,177,0.6)",
              textDecoration: "none",
              flexShrink: 0,
              whiteSpace: "nowrap",
              marginTop: "24px",
              marginBottom: "24px",
            }}
          >
            <Sparkles
              fill="white"
              style={{ width: "18px", height: "17px", color: "white", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                letterSpacing: "-0.04em",
                color: "white",
                lineHeight: "28px",
              }}
            >
              {ctaLabel}
            </span>
          </Link>

          {/* Nav items list — gap 8px */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {NAV_ITEMS.map(({ label, icon: Icon, href, badge }) => {
              const isActive =
                href === "/" ? currentHref === "/" : currentHref.startsWith(href);

              return (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "251px",
                    height: isActive ? "38px" : "40px",
                    borderRadius: "8px",
                    padding: isActive ? "8px 12px" : "9px 12px",
                    background: isActive ? "#F0F0F0" : "transparent",
                    textDecoration: "none",
                    transition: "background 150ms",
                  }}
                >
                  <Icon
                    style={{
                      width: "20px",
                      height: "20px",
                      color: isActive ? "#303030" : "rgba(94,94,94,0.8)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily:
                        "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                      fontWeight: isActive ? 500 : 400,
                      fontSize: "16px",
                      letterSpacing: "-0.04em",
                      color: isActive ? "#303030" : "rgba(94,94,94,0.8)",
                      lineHeight: "140%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {label}
                  </span>
                  {badge ? (
                    <span
                      style={{
                        width: "37px",
                        height: "20px",
                        borderRadius: "8px",
                        padding: "0 10px",
                        background: "#FF5623",
                        boxShadow: "inset 0px 0px 32.3px rgba(255,161,10,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "140%",
                        letterSpacing: "-0.04em",
                        color: "#FFFFFF",
                        flexShrink: 0,
                        marginLeft: "6px",
                      }}
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM SECTION — settings + school card
      ══════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "256px",
        }}
      >

        {/* Settings row */}
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "256px",
            height: "38px",
            padding: "8px 12px",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          <Settings
            style={{ width: "20px", height: "20px", color: "rgba(94,94,94,0.8)", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              letterSpacing: "-0.04em",
              color: "rgba(94,94,94,0.8)",
            }}
          >
            Settings
          </span>
        </Link>

        {/* School card — 256×80, bg #F0F0F0, border-radius 16px, padding 12px */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "256px",
            height: "80px",
            borderRadius: "16px",
            padding: "12px",
            gap: "16px",
            background: "#F0F0F0",
            flexShrink: 0,
          }}
        >
          {/* Illustrated avatar — 59×56px */}
          <div
            style={{ width: "59px", height: "56px", flexShrink: 0, overflow: "hidden" }}
          >
            <svg
              viewBox="0 0 59 56"
              fill="none"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Card background */}
              <rect width="59" height="56" rx="10" fill="#E4D9F8" />
              {/* Body / shirt */}
              <path
                d="M5 56c0-13.25 10.75-24 24-24s24 10.75 24 24"
                fill="#6D28D9"
              />
              {/* Neck */}
              <rect x="24.5" y="28" width="10" height="6" rx="3" fill="#FBBF91" />
              {/* Head */}
              <circle cx="29" cy="22" r="12" fill="#FBBF91" />
              {/* Hair top */}
              <path
                d="M17 20c0-6.63 5.37-12 12-12h0c6.63 0 12 5.37 12 12"
                fill="#1A1A1A"
              />
              {/* Hair side left */}
              <rect x="17" y="18" width="3" height="8" rx="1.5" fill="#1A1A1A" />
              {/* Left eye */}
              <circle cx="25" cy="22" r="1.5" fill="#1A1A1A" />
              {/* Right eye */}
              <circle cx="33" cy="22" r="1.5" fill="#1A1A1A" />
              {/* Smile */}
              <path
                d="M26 26 Q29 29 32 26"
                stroke="#1A1A1A"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              {/* Glasses left */}
              <rect
                x="22"
                y="20"
                width="6"
                height="4.5"
                rx="2"
                stroke="#1A1A1A"
                strokeWidth="0.8"
                fill="none"
              />
              {/* Glasses right */}
              <rect
                x="30"
                y="20"
                width="6"
                height="4.5"
                rx="2"
                stroke="#1A1A1A"
                strokeWidth="0.8"
                fill="none"
              />
              {/* Glasses bridge */}
              <line
                x1="28"
                y1="22.25"
                x2="30"
                y2="22.25"
                stroke="#1A1A1A"
                strokeWidth="0.8"
              />
            </svg>
          </div>

          {/* School info text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "-0.04em",
                color: "#303030",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Delhi Public School
            </span>
            <span
              style={{
                fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "-0.04em",
                color: "#5E5E5E",
                lineHeight: 1.2,
              }}
            >
              Bokaro Steel City
            </span>
          </div>
        </div>

      </div>
    </aside>
  );
}
