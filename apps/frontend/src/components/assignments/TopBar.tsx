"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Bell, LayoutGrid, Menu, Sparkles } from "lucide-react";

interface TopBarProps {
  variant?: "assignment" | "paper";
}

export function TopBar({ variant = "assignment" }: TopBarProps) {
  const router = useRouter();

  return (
    <>
      <header
        className="hidden md:flex"
        style={{
          position: "fixed",
          top: "12px",
          left: "327px",
          right: "12px",
          height: "56px",
          borderRadius: "16px",
          padding: "0 12px 0 24px",
          gap: "10px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 20,
          boxShadow:
            "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
        }}
      >
        {variant === "paper" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                gap: "12px",
                boxShadow:
                  "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ChevronLeft style={{ width: "24px", height: "24px", color: "#303030" }} />
            </button>

            <button
              onClick={() => router.push("/create")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "20px",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <Sparkles
                style={{ width: "18.32px", height: "17.32px", color: "#A9A9A9" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "-0.04em",
                  color: "#A9A9A9",
                  width: "85px",
                  height: "19px",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                }}
              >
                Create New
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                gap: "12px",
                boxShadow:
                  "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ChevronLeft style={{ width: "24px", height: "24px", color: "#303030" }} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "20px",
              }}
            >
              <LayoutGrid
                style={{ width: "20px", height: "20px", color: "#A9A9A9", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "-0.04em",
                  color: "#A9A9A9",
                  whiteSpace: "nowrap",
                }}
              >
                Assignment
              </span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            aria-label="Notifications"
            style={{
              position: "relative",
              width: "36px",
              height: "36px",
              borderRadius: "100px",
              background: "#F6F6F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <Bell style={{ width: "24px", height: "24px", color: "#303030" }} />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "8px",
                height: "8px",
                borderRadius: "100px",
                background: "#EF4444",
                display: "block",
              }}
            />
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "157px",
              height: "44px",
              borderRadius: "12px",
              padding: "6px 12px",
              background: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow:
                "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "100px",
                background: "#F6F6F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 32 32" fill="none" style={{ width: "32px", height: "32px" }}>
                <circle cx="16" cy="16" r="16" fill="#F0ECE8" />
                <path d="M4 32c0-6.63 5.37-12 12-12s12 5.37 12 12" fill="#7C3AED" />
                <circle cx="16" cy="13" r="7" fill="#FBBF91" />
                <path d="M9 11c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#1A1A1A" />
                <circle cx="13.5" cy="13" r="1" fill="#1A1A1A" />
                <circle cx="18.5" cy="13" r="1" fill="#1A1A1A" />
                <path
                  d="M14 16 Q16 18 18 16"
                  stroke="#1A1A1A"
                  strokeWidth="0.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                width: "93px",
                height: "24px",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily:
                    "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "-0.04em",
                  color: "#303030",
                  whiteSpace: "nowrap",
                }}
              >
                John Doe
              </span>
              <ChevronDown
                style={{ width: "24px", height: "24px", color: "#303030", flexShrink: 0 }}
              />
            </div>
          </button>
        </div>
      </header>

      <header className="md:hidden h-14 bg-white border-b border-[#EFEFEF] flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-semibold text-[#1A1A1A]">Assignment</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280]">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E8460E] rounded-full" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280]">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>
    </>
  );
}
