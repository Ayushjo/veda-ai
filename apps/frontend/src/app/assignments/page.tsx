"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Bell,
  Home,
  FileText,
  BookOpen,
  Wand2,
  SlidersHorizontal,
  Search,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import { Sidebar } from "@/components/assignments/Sidebar";
import { TopBar } from "@/components/assignments/TopBar";
import { MobileBottomNav } from "@/components/assignments/MobileBottomNav";

// ─── Font shorthand ───────────────────────────────────────────────────────────
const F = "var(--font-bricolage), 'Bricolage Grotesque', sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Assignment {
  id: number;
  name: string;
  assignedOn: string;
  due: string;
}

// ─── Mock data (8 cards = 4 rows × 2) ────────────────────────────────────────
const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 1, name: "Quiz on Electricity",    assignedOn: "20-06-2025", due: "21-06-2025" },
  { id: 2, name: "Chapter 3 Test",         assignedOn: "18-06-2025", due: "25-06-2025" },
  { id: 3, name: "Physics Lab Report",     assignedOn: "15-06-2025", due: "22-06-2025" },
  { id: 4, name: "Math Problem Set",       assignedOn: "19-06-2025", due: "26-06-2025" },
  { id: 5, name: "History Essay",          assignedOn: "17-06-2025", due: "24-06-2025" },
  { id: 6, name: "Chemistry Worksheet",   assignedOn: "16-06-2025", due: "23-06-2025" },
  { id: 7, name: "Biology Diagrams",      assignedOn: "14-06-2025", due: "21-06-2025" },
  { id: 8, name: "English Literature",    assignedOn: "20-06-2025", due: "27-06-2025" },
  { id: 9, name: "Geography Map Quiz",     assignedOn: "21-06-2025", due: "28-06-2025" },
  { id: 10, name: "Computer Science Task", assignedOn: "22-06-2025", due: "29-06-2025" },
  { id: 11, name: "Hindi Grammar Drill",    assignedOn: "23-06-2025", due: "30-06-2025" },
  { id: 12, name: "Art Reflection Sheet",   assignedOn: "24-06-2025", due: "01-07-2025" },
];

// ─── Mobile bottom-nav items (Assignments active) ─────────────────────────────
const BOTTOM_NAV = [
  { label: "Home",        Icon: Home,     active: false },
  { label: "Assignments", Icon: FileText,  active: true  },
  { label: "Library",     Icon: BookOpen,  active: false },
  { label: "AI Toolkit",  Icon: Wand2,     active: false },
] as const;

// ─── Shared SVG illustration (scales via size prop) ───────────────────────────
function EmptyStateIllustration({ size = 300 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="150" cy="160" r="105" fill="#E8E8EC" />
      <path d="M42 88 C38 80 34 72 40 66 C46 60 54 64 52 72 C50 80 42 82 40 90 C38 98 44 106 52 104 C60 102 64 94 60 88"
        stroke="#1A1A2E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="196" y="62" width="82" height="52" rx="8" fill="white"
        style={{ filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.08))" }} />
      <circle cx="212" cy="78" r="6" fill="#D1D5DB" />
      <rect x="224" y="74" width="40" height="6" rx="3" fill="#E5E7EB" />
      <rect x="224" y="84" width="28" height="5" rx="2.5" fill="#F3F4F6" />
      <rect x="212" y="97" width="52" height="5" rx="2.5" fill="#F3F4F6" />
      <rect x="62" y="110" width="82" height="106" rx="10" fill="white"
        style={{ filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.08))" }} />
      <rect x="62" y="110" width="82" height="22" rx="10" fill="#1A1A2E" />
      <rect x="62" y="122" width="82" height="10" fill="#1A1A2E" />
      <rect x="74" y="144" width="48" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="74" y="156" width="56" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="74" y="168" width="40" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="74" y="180" width="52" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="74" y="192" width="34" height="5" rx="2.5" fill="#F3F4F6" />
      <circle cx="162" cy="150" r="52" fill="white"
        style={{ filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.12))" }} />
      <circle cx="162" cy="150" r="52" stroke="#B8B5CC" strokeWidth="6" fill="white" />
      <line x1="141" y1="129" x2="183" y2="171" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
      <line x1="183" y1="129" x2="141" y2="171" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
      <line x1="204" y1="192" x2="232" y2="220" stroke="#9CA3AF" strokeWidth="10" strokeLinecap="round" />
      <path d="M78 222 L81.5 232 L92 235.5 L81.5 239 L78 249 L74.5 239 L64 235.5 L74.5 232 Z" fill="#5B8DEF" />
      <circle cx="246" cy="168" r="5" fill="#4A6FA5" />
    </svg>
  );
}

// ─── Three-dot dropdown menu ───────────────────────────────────────────────────
function CardMenu({
  onView,
  onDelete,
}: {
  onView: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Assignment options"
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 2, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <MoreVertical style={{ width: 24, height: 24, color: "#303030" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: 30,
            /* wide enough so "View Assignment" fits on one line */
            width: 168,
            borderRadius: 16, padding: 8, background: "white",
            display: "flex", flexDirection: "column", gap: 4,
            boxShadow: "0px 32px 48px rgba(0,0,0,0.05), 0px 16px 48px rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        >
          {/* View Assignment — must stay on one line */}
          <button
            onClick={() => { setOpen(false); onView(); }}
            style={{
              width: "100%", height: 32, borderRadius: 8, padding: "0 10px",
              display: "flex", alignItems: "center", background: "transparent",
              border: "none", cursor: "pointer", fontFamily: F,
              fontWeight: 500, fontSize: 14, color: "#303030", textAlign: "left",
              whiteSpace: "nowrap", transition: "background 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F6F6F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            View Assignment
          </button>

          {/* Delete */}
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            style={{
              width: "100%", height: 32, borderRadius: 8, padding: "0 10px",
              display: "flex", alignItems: "center", background: "#F6F6F6",
              border: "none", cursor: "pointer", fontFamily: F,
              fontWeight: 500, fontSize: 14, color: "#C53535", textAlign: "left",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FCE8E8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F6F6F6"; }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Single assignment card (542×162) ─────────────────────────────────────────
function AssignmentCard({
  assignment,
  onDelete,
}: {
  assignment: Assignment;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      style={{
        /* flex:1 so each card fills its half of the row on any viewport width */
        flex: 1, minWidth: 0,
        height: 162, borderRadius: 24, padding: 24,
        background: "white", display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top row — name + three-dot */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <span
          style={{
            fontFamily: F, fontWeight: 800, fontSize: 24,
            lineHeight: "120%", letterSpacing: "-0.04em", color: "#303030",
          }}
        >
          {assignment.name}
        </span>

        <CardMenu
          onView={() => { /* navigate to assignment detail */ }}
          onDelete={() => onDelete(assignment.id)}
        />
      </div>

      {/* Bottom row — dates */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: F, fontSize: 16, lineHeight: "120%", letterSpacing: "-0.04em", color: "#303030" }}>
          <span style={{ fontWeight: 800 }}>Assigned on :</span>{" "}
          <span style={{ fontWeight: 400 }}>{assignment.assignedOn}</span>
        </span>
        <span style={{ fontFamily: F, fontSize: 16, lineHeight: "120%", letterSpacing: "-0.04em", color: "#303030" }}>
          <span style={{ fontWeight: 800 }}>Due :</span>{" "}
          <span style={{ fontWeight: 400 }}>{assignment.due}</span>
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = useCallback((id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const filtered = assignments.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chunk into rows of 2
  const rows: [Assignment, Assignment | null][] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push([filtered[i], filtered[i + 1] ?? null]);
  }

  const hasAssignments = assignments.length > 0;

  return (
    <div className="min-h-screen bg-[#CECECE] md:bg-[#E8E8E8]">

      {/* ── Desktop shell (hidden on mobile) ── */}
      <div className="hidden md:block">
        <Sidebar />
        <TopBar />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE NAV — fixed pill navbar
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30"
        style={{ padding: "12.5px 10px", background: "rgba(255,255,255,0.01)" }}
      >
        <div className="w-full bg-white flex items-center justify-between"
          style={{ borderRadius: 16, height: 64, paddingLeft: 12, paddingRight: 16 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            {/* Logo mark — actual logo image, 40×40, border-radius 12px */}
            <img
              src="/logo-mobile.png"
              alt="VedaAI"
              style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "block" }}
            />
            {/* VedaAI wordmark */}
            <span style={{
              fontFamily: F, fontWeight: 700, fontSize: 28,
              letterSpacing: "-0.06em", color: "#303030",
              lineHeight: 1,
            }}>VedaAI</span>
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button className="relative flex items-center justify-center bg-[#F6F6F6] flex-shrink-0"
              style={{ width: 36, height: 36, borderRadius: "100px" }}>
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <span className="absolute bg-red-500 rounded-full"
                style={{ width: 7, height: 7, top: 5, right: 5 }} />
            </button>
            <div className="bg-[#F6F6F6] overflow-hidden flex-shrink-0"
              style={{ width: 32, height: 32, borderRadius: "100px" }}>
              <svg viewBox="0 0 32 32" fill="none" style={{ width: "100%", height: "100%" }}>
                <circle cx="16" cy="16" r="16" fill="#F0ECE8" />
                <path d="M4 32c0-6.63 5.37-12 12-12s12 5.37 12 12" fill="#7C3AED" />
                <circle cx="16" cy="13" r="7" fill="#FBBF91" />
                <path d="M9 11c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#1A1A1A" />
              </svg>
            </div>
            <button className="flex flex-col justify-center flex-shrink-0"
              style={{ width: 18, gap: 3.5 }}>
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: 18, height: 1.5 }} />
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: 18, height: 1.5 }} />
              <span className="block rounded-full bg-[#1D1B20]" style={{ width: 18, height: 1.5 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP FILLED STATE
      ══════════════════════════════════════════════════════════════ */}
      {hasAssignments ? (
        <div
          className="hidden md:block"
          style={{
            position: "relative",
            marginLeft: 327,
            marginRight: 12,
            paddingTop: 110,
            paddingBottom: 100,
            minHeight: "100vh",
          }}
        >
          {/* ── Section 1: Page header ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 16,
            padding: "0 8px", height: 50, marginBottom: 16 }}>
            {/* Green dot */}
            <div style={{
              width: 12, height: 12, borderRadius: "100px",
              background: "#4BC26D",
              border: "4px solid rgba(75,194,109,0.4)",
              boxShadow: "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)",
              flexShrink: 0,
            }} />
            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20,
                lineHeight: "140%", letterSpacing: "-0.04em", color: "#303030" }}>
                Assignments
              </span>
              <span style={{ fontFamily: F, fontWeight: 400, fontSize: 14,
                color: "rgba(94,94,94,0.55)", letterSpacing: "-0.04em" }}>
                Manage and create assignments for your classes.
              </span>
            </div>
          </div>

          {/* ── Section 2: Filter bar ── */}
          <div style={{ height: 64, borderRadius: 20, padding: "0 16px",
            background: "white", display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 16 }}>
            {/* Filter By */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal style={{ width: 20, height: 20, color: "#A9A9A9", flexShrink: 0 }} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14,
                letterSpacing: "-0.04em", color: "#A9A9A9", whiteSpace: "nowrap" }}>
                Filter By
              </span>
            </div>

            {/* Search bar */}
            <div style={{ width: 380, height: 44, borderRadius: "100px",
              border: "1px solid rgba(0,0,0,0.2)", padding: "0 16px",
              display: "flex", alignItems: "center", gap: 10 }}>
              <Search style={{ width: 20, height: 20, color: "#A9A9A9", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent", outline: "none", border: "none",
                  width: "100%", fontFamily: F, fontWeight: 500, fontSize: 14,
                  color: "#303030", letterSpacing: "-0.04em",
                }}
              />
            </div>
          </div>

          {/* ── Section 3: Assignment grid ── */}
          {filtered.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
              paddingTop: 80, flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: "#303030" }}>
                No results found
              </span>
              <span style={{ fontFamily: F, fontWeight: 400, fontSize: 16,
                color: "rgba(94,94,94,0.8)" }}>
                Try a different search term.
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {rows.map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 16, height: 162 }}>
                  <AssignmentCard assignment={row[0]} onDelete={handleDelete} />
                  {row[1] && <AssignmentCard assignment={row[1]} onDelete={handleDelete} />}
                </div>
              ))}
            </div>
          )}

          {/* ── Section 4: Fixed bottom blur + CTA ── */}
          <div
            style={{
              position: "fixed", bottom: 0, left: 327, right: 0,
              height: 73, padding: "10px 0", zIndex: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              /* Exact Figma values */
              background: "linear-gradient(176.12deg, rgba(234,234,234,0) 3.17%, #DADADA 81.22%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              /* Border radius XXL = 48px per Figma */
              borderRadius: "48px 48px 0 0",
            }}
          >
            <Link
              href="/create"
              style={{
                width: 208, height: 46, borderRadius: 48,
                padding: "12px 24px", background: "#181818",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 4, textDecoration: "none",
                boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)",
                outline: "1.5px solid rgba(255,255,255,0.15)",
                outlineOffset: "-1.5px",
              }}
            >
              <Plus style={{ width: 20, height: 20, color: "white", flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 16,
                letterSpacing: "-0.04em", color: "white", whiteSpace: "nowrap" }}>
                Create Assignment
              </span>
            </Link>
          </div>
        </div>
      ) : (
        /* ── DESKTOP ZERO STATE ── */
        <div className="hidden md:flex items-center justify-center"
          style={{ position: "absolute", top: 90, left: 327, right: 12, bottom: 0, minHeight: 678 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", width: 486, gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
              width: 486, gap: 12 }}>
              <EmptyStateIllustration size={300} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                width: 486, gap: 2 }}>
                <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 20, lineHeight: "140%",
                  letterSpacing: "-0.04em", color: "#303030", textAlign: "center", margin: 0 }}>
                  No assignments yet
                </h2>
                <p style={{ fontFamily: F, fontWeight: 400, fontSize: 16, lineHeight: "140%",
                  letterSpacing: "-0.04em", color: "rgba(94,94,94,0.8)", textAlign: "center",
                  maxWidth: 486, margin: 0 }}>
                  Create your first assignment to start collecting and grading student submissions.
                  You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
              </div>
            </div>
            <Link href="/create" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 4, width: 277, height: 46, borderRadius: 48, padding: "12px 24px",
              background: "#181818", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.3)",
              outline: "1.5px solid rgba(255,255,255,0.18)", outlineOffset: "-1.5px",
              textDecoration: "none", flexShrink: 0,
            }}>
              <Plus style={{ width: 20, height: 20, color: "white", flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 16,
                lineHeight: "140%", letterSpacing: "-0.04em", color: "white",
                textAlign: "center", whiteSpace: "nowrap" }}>
                Create Your First Assignment
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MOBILE — FILLED STATE (when assignments exist)
      ══════════════════════════════════════════════════════════════ */}
      {hasAssignments ? (
        <div className="md:hidden" style={{ background: "#CECECE", minHeight: "100vh", overflowX: "hidden" }}>
          <div className="pb-40" style={{ width: "100%", maxWidth: 393, margin: "0 auto", paddingTop: 100, display: "flex", flexDirection: "column", gap: 24, padding: "100px 10px 160px" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, width: "100%" }}>
              <button style={{ width: 48, height: 48, borderRadius: "100px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>
                <ChevronLeft style={{ width: 20, height: 20, color: "#303030" }} />
              </button>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, lineHeight: "140%", letterSpacing: "-0.04em", color: "#303030" }}>Assignments</span>
              <div style={{ width: 48, flexShrink: 0 }} />
            </div>
            {/* Content block */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
              {/* Filter bar */}
              <div style={{ height: 64, borderRadius: 16, padding: "0 16px", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <SlidersHorizontal style={{ width: 20, height: 20, color: "#A9A9A9", flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontWeight: 400, fontSize: 14, letterSpacing: "-0.04em", color: "#A9A9A9" }}>Filter</span>
                </div>
                <div style={{ width: 228, height: 44, borderRadius: "100px", border: "1px solid rgba(0,0,0,0.2)", padding: "0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Search style={{ width: 20, height: 20, color: "#A9A9A9", flexShrink: 0 }} />
                  <input type="text" placeholder="Search Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", outline: "none", border: "none", width: "100%", fontFamily: F, fontWeight: 400, fontSize: 14, color: "#303030", letterSpacing: "-0.04em" }} />
                </div>
              </div>
              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.slice(0, 5).map((a) => (
                  <div key={a.id} style={{ width: "100%", minHeight: 116, borderRadius: 24, padding: 20, background: "rgba(255,255,255,0.75)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 25 }}>
                        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, lineHeight: "140%", letterSpacing: "-0.04em", color: "#303030" }}>{a.name}</span>
                        <CardMenu onView={() => {}} onDelete={() => handleDelete(a.id)} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: F, fontSize: 14, lineHeight: "120%", letterSpacing: "-0.04em", color: "#303030" }}>
                          <span style={{ fontWeight: 800 }}>Assigned on :</span>{" "}
                          <span style={{ fontWeight: 400 }}>{a.assignedOn}</span>
                        </span>
                        <span style={{ fontFamily: F, fontSize: 14, lineHeight: "120%", letterSpacing: "-0.04em", color: "#303030" }}>
                          <span style={{ fontWeight: 800 }}>Due :</span>{" "}
                          <span style={{ fontWeight: 400 }}>{a.due}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/create" aria-label="Create assignment" className="md:hidden fixed bottom-24 right-4 z-50" style={{ width: 48, height: 48, borderRadius: "100px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)" }}>
            <Plus style={{ width: 20, height: 20, color: "#E8460E" }} strokeWidth={2} />
          </Link>
          <MobileBottomNav />
        </div>
      ) : (
        /* ══ MOBILE ZERO STATE ══ */
        <div className="md:hidden flex flex-col items-center justify-center px-4 pt-[81px] pb-36" style={{ minHeight: "100dvh" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 373, gap: 12 }}>
            <EmptyStateIllustration size={220} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 12 }}>
              <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 20, lineHeight: "140%", letterSpacing: "-0.04em", color: "#303030", textAlign: "center", margin: 0 }}>No assignments yet</h2>
              <p style={{ fontFamily: F, fontWeight: 400, fontSize: 16, lineHeight: "140%", letterSpacing: "-0.04em", color: "rgba(94,94,94,0.8)", textAlign: "center", width: "100%", maxWidth: 373, margin: 0 }}>Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.</p>
            </div>
            <Link href="/create" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: 277, height: 46, borderRadius: "100px", padding: "12px 24px", background: "#181818", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.3)", outline: "1.5px solid rgba(255,255,255,0.18)", outlineOffset: "-1.5px", textDecoration: "none", flexShrink: 0 }}>
              <Plus style={{ width: 20, height: 20, color: "white", flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 16, lineHeight: "140%", letterSpacing: "-0.04em", color: "white", textAlign: "center", whiteSpace: "nowrap" }}>Create Your First Assignment</span>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/create" aria-label="Create assignment" style={{ position: "fixed", bottom: 112, right: 16, zIndex: 50, width: 48, height: 48, borderRadius: "100px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)" }}>
              <Plus style={{ width: 20, height: 20, color: "#E8460E" }} strokeWidth={2} />
            </Link>
          </div>
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40" style={{ padding: "8px 10px", background: "rgba(255,255,255,0.01)" }}>
            <div style={{ background: "#181818", borderRadius: 24, height: 72, padding: "0 24px", boxShadow: "0px 32px 48px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {BOTTOM_NAV.map(({ label, Icon, active }) => (
                <button key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 52, gap: 6, border: "none", background: "none", cursor: "pointer", flexShrink: 0 }}>
                  <div style={active ? { background: "white", borderRadius: "100px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" } : { display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color: active ? "#181818" : "rgba(255,255,255,0.25)" }} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: active ? 700 : 600, letterSpacing: "-0.04em", lineHeight: 1, color: active ? "#FFFFFF" : "rgba(255,255,255,0.25)" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
