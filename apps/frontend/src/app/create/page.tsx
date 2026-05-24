"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Home,
  Users,
  BookOpen,
  Wand2,
} from "lucide-react";

import { AssignmentForm } from "@/components/create/AssignmentForm";
import { Sidebar } from "@/components/assignments/Sidebar";
import { TopBar } from "@/components/assignments/TopBar";

const MOBILE_NAV_ITEMS = [
  { label: "Home",       Icon: Home,     active: false },
  { label: "My Groups",  Icon: Users,    active: true  },
  { label: "Library",    Icon: BookOpen, active: false },
  { label: "AI Toolkit", Icon: Wand2,    active: false },
] as const;

export default function CreateAssignmentPage() {
  const router = useRouter();

  return (
    <>
      {/* Desktop-only: fixed floating sidebar + topbar.
          Wrapped in hidden sm:block so the TopBar mobile section
          (which uses md:hidden internally) never renders on mobile. */}
      <div className="hidden sm:block">
        <Sidebar />
        <TopBar />
      </div>

      {/* ── MOBILE: sticky pill navbar ───────────────────────────────── */}
      <div
        className="sm:hidden fixed top-0 left-0 right-0 z-30"
        style={{ padding: "12.5px 10px", background: "rgba(255,255,255,0.01)" }}
      >
        <div
          className="w-full bg-white flex items-center justify-between"
          style={{ borderRadius: "16px", height: "56px", paddingLeft: "12px", paddingRight: "16px" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="bg-[#E8460E] flex items-center justify-center flex-shrink-0"
              style={{ width: "28px", height: "28px", borderRadius: "6px" }}
            >
              <span className="text-white font-extrabold text-[11px] leading-none">V</span>
            </div>
            <span className="font-bold text-[#1A1A1A] text-[15px]">VedaAI</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center" style={{ gap: "12px" }}>
            <button
              className="relative flex items-center justify-center bg-[#F6F6F6] flex-shrink-0"
              style={{ width: "36px", height: "36px", borderRadius: "100px" }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <span
                className="absolute bg-red-500 rounded-full"
                style={{ width: "7px", height: "7px", top: "5px", right: "5px" }}
              />
            </button>

            <div
              className="bg-[#F6F6F6] overflow-hidden flex-shrink-0"
              style={{ width: "32px", height: "32px", borderRadius: "100px" }}
            >
              <svg viewBox="0 0 32 32" fill="none" style={{ width: "100%", height: "100%" }}>
                <circle cx="16" cy="16" r="16" fill="#F0ECE8" />
                <circle cx="16" cy="12" r="5" fill="#D4956A" />
                <path d="M8 28c0-4.42 3.58-8 8-8s8 3.58 8 8" fill="#8B5CF6" />
              </svg>
            </div>

            <button
              className="flex flex-col justify-center flex-shrink-0"
              style={{ width: "18px", gap: "3.5px" }}
              aria-label="Menu"
            >
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: "18px", height: "1.5px" }} />
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: "18px", height: "1.5px" }} />
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: "18px", height: "1.5px" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── FULL PAGE BACKGROUND WRAPPER ────────────────────────────── */}
      <div className="bg-[#CECECE] sm:bg-[#F0F0F0] overflow-x-hidden pt-[81px] sm:pt-0 min-h-screen">

        {/* Content area — desktop offset handled here */}
        <div className="sm:pt-[80px] sm:pl-[339px] sm:pr-[12px]">

          {/* Desktop page header (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2.5 px-5 pt-5 pb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#22C55E] flex-shrink-0" />
            <div>
              <h1 className="text-[17px] font-bold text-[#1A1A1A] leading-tight">Create Assignment</h1>
              <p className="text-[13px] text-[#9CA3AF] mt-0.5">Set up a new assignment for your students</p>
            </div>
          </div>

          {/* Desktop progress bar (hidden on mobile) */}
          <div className="hidden sm:block px-5 pt-3 pb-0">
            <div className="w-full max-w-[810px] mx-auto h-[3px] rounded-full bg-[#D9D9D9] overflow-hidden">
              <div className="h-full w-1/2 bg-[#5E5E5E] rounded-full transition-all duration-300" />
            </div>
          </div>

          {/* Mobile: header row + progress bar (hidden on desktop) */}
          <div className="sm:hidden flex flex-col gap-6 pt-6 mx-[10px] px-3">
            {/* Back button + title */}
            <div className="flex items-center justify-between h-12">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(24px)",
                }}
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-[#303030]" />
              </button>

              <span
                className="font-bold text-[#303030]"
                style={{ fontSize: "16px", letterSpacing: "-0.04em" }}
              >
                Create Assignment
              </span>

              <div style={{ width: "48px" }} />
            </div>

            {/* Progress bar — two equal halves */}
            <div className="flex gap-2">
              <div style={{ flex: 1, height: 0, borderBottom: "5px solid #303030", borderRadius: "100px" }} />
              <div style={{ flex: 1, height: 0, borderBottom: "5px solid #DADADA", borderRadius: "100px" }} />
            </div>
          </div>

          {/* ── FORM — single instance ─────────────────────────────────
              Mobile:  mx-[10px] px-3 pt-6 pb-[180px]
              Desktop: px-5 pt-5 pb-10
          ────────────────────────────────────────────────────────── */}
          <main className="mx-[10px] px-3 pt-6 pb-[180px] sm:mx-0 sm:w-full sm:px-5 sm:pt-5 sm:pb-10">
            <AssignmentForm />
          </main>

        </div>
      </div>

      {/* ── MOBILE: fixed bottom area (hidden on desktop) ────────────── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex flex-col"
        style={{
          padding: "8px 10px",
          background: "rgba(255,255,255,0.01)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Prev / Next */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center gap-1.5 bg-white flex-shrink-0"
            style={{ width: "134px", height: "46px", borderRadius: "100px" }}
          >
            <ChevronLeft className="w-4 h-4 text-[#303030]" />
            <span className="font-medium text-[#303030]" style={{ fontSize: "16px", letterSpacing: "-0.04em" }}>
              Previous
            </span>
          </button>

          <button
            type="submit"
            form="create-assignment-form"
            className="flex items-center justify-center gap-1.5 flex-shrink-0"
            style={{
              width: "106px",
              height: "46px",
              borderRadius: "100px",
              background: "#181818",
              boxShadow: "0px 32px 48px rgba(0,0,0,0.2)",
            }}
          >
            <span className="font-medium text-white" style={{ fontSize: "16px", letterSpacing: "-0.04em" }}>
              Next
            </span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Bottom nav pill */}
        <div
          className="w-full flex items-center justify-between"
          style={{
            background: "#181818",
            borderRadius: "24px",
            height: "72px",
            padding: "0 24px",
            boxShadow: "0px 32px 48px rgba(0,0,0,0.2)",
          }}
        >
          {MOBILE_NAV_ITEMS.map(({ label, Icon, active }) => (
            <button
              key={label}
              className="flex flex-col items-center justify-center flex-shrink-0"
              style={{ width: "52px", gap: "6px" }}
            >
              <div
                className="flex items-center justify-center"
                style={
                  active
                    ? { background: "white", borderRadius: "100px", padding: "5px 10px" }
                    : {}
                }
              >
                <Icon
                  style={{
                    width: "18px",
                    height: "18px",
                    color: active ? "#181818" : "rgba(255,255,255,0.4)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: active ? 700 : 600,
                  letterSpacing: "-0.04em",
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
