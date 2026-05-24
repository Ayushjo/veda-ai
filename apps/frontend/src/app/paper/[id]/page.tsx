"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";

import { Sidebar } from "@/components/assignments/Sidebar";
import { TopBar } from "@/components/assignments/TopBar";
import api from "@/lib/api";

// ─── Font constants ────────────────────────────────────────────────────────────
const BG   = "var(--font-bricolage),'Bricolage Grotesque',sans-serif";
const INTER = "var(--font-inter),Inter,ui-sans-serif,system-ui,sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  text: string;
  type: "mcq" | "short" | "long" | "true-false";
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  options: string[];
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface PaperData {
  _id: string;
  assignmentId: string;
  metadata: {
    subject: string;
    gradeLevel: string;
    totalMarks: number;
    duration: string;
    dueDate: string;
  };
  sections: Section[];
  generatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function diffLabel(d: string) {
  if (d === "easy")   return "Easy";
  if (d === "medium") return "Moderate";
  return "Challenging";
}

function diffColor(d: string) {
  if (d === "easy")   return "#16A34A";
  if (d === "medium") return "#D97706";
  return "#DC2626";
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ marginLeft: 316, paddingTop: 82, minHeight: "100vh", background: "#E8E8E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Loader2 size={40} style={{ color: "#5E5E5E", animation: "spin 1s linear infinite" }} />
        <p style={{ fontFamily: BG, fontWeight: 600, fontSize: 16, color: "#5E5E5E", margin: 0 }}>
          Loading your paper…
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div style={{ marginLeft: 316, paddingTop: 82, minHeight: "100vh", background: "#E8E8E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", maxWidth: 400 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#DC2626", fontSize: 24, fontWeight: 700 }}>!</span>
        </div>
        <p style={{ fontFamily: BG, fontWeight: 700, fontSize: 18, color: "#303030", margin: 0 }}>Failed to load paper</p>
        <p style={{ fontFamily: BG, fontSize: 14, color: "#6B7280", margin: 0 }}>{message}</p>
        <button
          onClick={onBack}
          style={{ fontFamily: BG, background: "#181818", color: "white", borderRadius: 100, padding: "10px 28px", fontSize: 14, border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Back to Assignments
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaperPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;

  const [paper,       setPaper]       = useState<PaperData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // Fetch paper
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .get<{ paper: PaperData }>(`/api/papers/${id}`)
      .then((res) => {
        setPaper(res.data.paper);
        setLoading(false);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.error ??
          err?.message ??
          "An unknown error occurred.";
        setError(msg);
        setLoading(false);
      });
  }, [id]);

  // All questions flat list for answer key
  const allQuestions = paper?.sections.flatMap((s) => s.questions) ?? [];

  // ── Shell ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#E8E8E8" }}>
        <Sidebar />
        <TopBar />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen" style={{ background: "#E8E8E8" }}>
        <Sidebar />
        <TopBar />
        <ErrorState message={error ?? "Paper not found"} onBack={() => router.push("/assignments")} />
      </div>
    );
  }

  const { metadata, sections } = paper;

  return (
    <>
      {/* ── Print styles ──────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #paper-document, #paper-document * { visibility: visible; }
          #paper-document {
            position: absolute; left: 0; top: 0;
            width: 100%; box-shadow: none; border-radius: 0;
          }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "#E8E8E8" }}>
        {/* Desktop shell */}
        <Sidebar />
        <TopBar />

        {/* ── Main content area ──────────────────────────────────────────────── */}
        <div style={{
          marginLeft: 316,
          paddingTop: 82,
          minHeight: "100vh",
          background: "#E8E8E8",
        }}>
          {/* Outer dark wrapper */}
          <div style={{
            width: 1100,
            minHeight: 1681,
            borderRadius: 32,
            padding: 20,
            gap: 12,
            background: "#5E5E5E",
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
          }}>

            {/* ── 1. Dark announcement banner ──────────────────────────────── */}
            <div style={{
              width: 1060,
              borderRadius: 32,
              padding: "24px 32px",
              background: "rgba(24,24,24,0.8)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexShrink: 0,
            }}>
              {/* Message */}
              <p style={{
                fontFamily: BG,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: "140%",
                letterSpacing: "-0.04em",
                color: "white",
                margin: 0,
                flex: 1,
              }}>
                Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade{" "}
                <span style={{ color: "#FCD34D" }}>{metadata.gradeLevel}</span>{" "}
                <span style={{ color: "#FCD34D" }}>{metadata.subject}</span>{" "}
                classes on the NCERT chapters:
              </p>

              {/* Download button */}
              <button
                onClick={() => window.print()}
                style={{
                  width: 200,
                  height: 44,
                  borderRadius: 100,
                  padding: "0 24px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Download style={{ width: 24, height: 24, color: "#303030" }} />
                <span style={{ fontFamily: BG, fontWeight: 500, fontSize: 16, lineHeight: "22px", letterSpacing: "-0.04em", color: "#303030" }}>
                  Download as PDF
                </span>
              </button>
            </div>

            {/* ── 2. White paper document ──────────────────────────────────── */}
            <div
              id="paper-document"
              style={{
                width: 1060,
                borderRadius: 32,
                padding: 32,
                background: "white",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                flexShrink: 0,
              }}
            >
              {/* 2a. School header */}
              <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <h1 style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                  VedaAI School
                </h1>
                <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 24, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                  Subject: {metadata.subject}
                </p>
                <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 24, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                  Class: {metadata.gradeLevel}
                </p>
                <hr style={{ width: "100%", border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
              </div>

              {/* 2b. Time + Marks row */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontFamily: INTER, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
                    <strong>Time Allowed:</strong>{" "}
                    <span style={{ fontWeight: 400 }}>{metadata.duration}</span>
                  </span>
                  <span style={{ fontFamily: INTER, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
                    <strong>Maximum Marks:</strong>{" "}
                    <span style={{ fontWeight: 400 }}>{metadata.totalMarks}</span>
                  </span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
              </div>

              {/* 2c. General instruction */}
              <div>
                <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                  All questions are compulsory unless stated otherwise.
                </p>
                <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
              </div>

              {/* 2d. Student info block */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(
                  [
                    ["Name", 180],
                    ["Roll Number", 140],
                  ] as [string, number][]
                ).map(([label, w]) => (
                  <p key={label} style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", color: "#303030", margin: 0 }}>
                    {label}:{" "}
                    <span style={{ display: "inline-block", width: w, borderBottom: "1.5px solid #303030", height: 18, verticalAlign: "bottom" }} />
                  </p>
                ))}
                <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", color: "#303030", margin: 0 }}>
                  Class: {metadata.gradeLevel} &nbsp; Section:{" "}
                  <span style={{ display: "inline-block", width: 100, borderBottom: "1.5px solid #303030", height: 18, verticalAlign: "bottom" }} />
                </p>
              </div>

              {/* 2e. Dynamic sections */}
              {sections.map((section, si) => (
                <div key={si} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Section title */}
                  <h2 style={{
                    fontFamily: INTER,
                    fontWeight: 600,
                    fontSize: 24,
                    lineHeight: "160%",
                    letterSpacing: "-0.04em",
                    color: "#303030",
                    textAlign: "center",
                    margin: 0,
                  }}>
                    {section.title}
                  </h2>

                  {/* Instruction */}
                  <p style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: 16,
                    lineHeight: "160%",
                    color: "#303030",
                    margin: 0,
                  }}>
                    {section.instruction}
                  </p>

                  {/* Questions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {section.questions.map((q) => (
                      <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <p style={{
                          fontFamily: INTER,
                          fontWeight: 400,
                          fontSize: 16,
                          lineHeight: "240%",
                          letterSpacing: "-0.04em",
                          color: "#303030",
                          margin: 0,
                        }}>
                          <span style={{ fontWeight: 700 }}>{q.id}.</span>{" "}
                          <span style={{
                            fontWeight: 600,
                            color: diffColor(q.difficulty),
                            fontSize: 13,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: `${diffColor(q.difficulty)}18`,
                            marginRight: 4,
                          }}>
                            [{diffLabel(q.difficulty)}]
                          </span>
                          {q.text}{" "}
                          <span style={{ color: "#6B7280", fontSize: 14 }}>
                            [{q.marks} Mark{q.marks !== 1 ? "s" : ""}]
                          </span>
                        </p>

                        {/* MCQ / True-False options */}
                        {(q.type === "mcq" || q.type === "true-false") && q.options.length > 0 && (
                          <div style={{ paddingLeft: 36, display: "flex", flexDirection: "column", gap: 0 }}>
                            {q.options.map((opt, oi) => (
                              <p key={oi} style={{
                                fontFamily: INTER,
                                fontSize: 15,
                                color: "#303030",
                                margin: 0,
                                lineHeight: "200%",
                              }}>
                                {opt}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* End of question paper */}
              <p style={{
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "240%",
                color: "#303030",
                textAlign: "center",
                margin: "8px 0 0 0",
                borderTop: "1px solid #E5E7EB",
                paddingTop: 12,
              }}>
                *** End of Question Paper ***
              </p>

              {/* 2f. Answer Key */}
              <div style={{ marginTop: 8 }}>
                <p style={{
                  fontFamily: INTER,
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: "240%",
                  letterSpacing: "-0.04em",
                  color: "#303030",
                  margin: 0,
                }}>
                  Answer Key:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {allQuestions.map((q) => (
                    <p key={q.id} style={{
                      fontFamily: INTER,
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "160%",
                      letterSpacing: "-0.04em",
                      color: "#303030",
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}>
                      {q.id}.{"  "}
                      {/* For MCQ/T-F with options, show "Answer to be filled" since we don't store correct option */}
                      Answer to be filled by teacher.
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {/* end white paper doc */}

          </div>
          {/* end outer wrapper */}
        </div>
        {/* end main content */}

      </div>
    </>
  );
}
