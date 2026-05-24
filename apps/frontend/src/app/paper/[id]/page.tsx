"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bell, Download, Loader2, RefreshCw } from "lucide-react";

import { Sidebar } from "@/components/assignments/Sidebar";
import { TopBar } from "@/components/assignments/TopBar";
import api from "@/lib/api";

const BG = "var(--font-bricolage), 'Bricolage Grotesque', sans-serif";
const INTER = "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

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

interface AnswerKeyEntry {
  questionNumber: number;
  answer: string;
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
  answerKey?: AnswerKeyEntry[];
}

function MobileNavbar() {
  return (
    <div
      className="sm:hidden fixed top-0 left-0 right-0 z-30"
      style={{
        width: "100vw",
        maxWidth: "100vw",
        margin: "0 auto",
        padding: "18px 10px",
        background: "transparent",
        boxSizing: "border-box",
      }}
    >
      <div
        className="bg-white flex items-center justify-between"
        style={{ width: "373px", maxWidth: "100%", height: "56px", margin: "0 auto", borderRadius: "16px", paddingLeft: "12px", paddingRight: "16px" }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <img
            src="/logo-mobile.png"
            alt="VedaAI"
            style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "block" }}
          />
          <span
            style={{
              fontFamily: BG,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "-0.06em",
              color: "#303030",
              lineHeight: 1,
            }}
          >
            VedaAI
          </span>
        </div>

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
              <path d="M4 32c0-6.63 5.37-12 12-12s12 5.37 12 12" fill="#7C3AED" />
              <circle cx="16" cy="13" r="7" fill="#FBBF91" />
              <path d="M9 11c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#1A1A1A" />
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
  );
}

function diffLabel(difficulty: Question["difficulty"]) {
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium") return "Moderate";
  return "Challenging";
}

function diffColor(difficulty: Question["difficulty"]) {
  if (difficulty === "easy") return "#16A34A";
  if (difficulty === "medium") return "#D97706";
  return "#DC2626";
}

function stripOptionLabel(option: string) {
  return option.replace(/^[A-D]\.\s*/, "").trim();
}

function splitSectionTitle(title: string) {
  const [primary, ...rest] = title.split(":");
  if (rest.length > 0) {
    return { title: primary.trim(), label: rest.join(":").trim() };
  }
  return { title: title.trim(), label: "Questions" };
}

function getFallbackLabel(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("objective")) return "Objective Questions";
  if (lower.includes("short")) return "Short Answer Questions";
  if (lower.includes("long")) return "Long Answer Questions";
  return "Questions";
}

function LoadingState({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      style={{
        marginLeft: mobile ? 0 : 316,
        paddingTop: mobile ? 86 : 82,
        minHeight: "100vh",
        background: mobile ? "#CECECE" : "#E8E8E8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader2 size={40} style={{ color: "#5E5E5E", animation: "spin 1s linear infinite" }} />
    </div>
  );
}

function ErrorState({
  message,
  onBack,
  mobile = false,
}: {
  message: string;
  onBack: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      style={{
        marginLeft: mobile ? 0 : 316,
        paddingTop: mobile ? 86 : 82,
        minHeight: "100vh",
        background: mobile ? "#CECECE" : "#E8E8E8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", maxWidth: mobile ? 373 : 400 }}>
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

function DesktopPaper({
  paper,
  allQuestions,
  onDownload,
}: {
  paper: PaperData;
  allQuestions: Question[];
  onDownload: () => void;
}) {
  const { metadata, sections } = paper;

  return (
    <div className="hidden sm:block min-h-screen" style={{ background: "#E8E8E8" }}>
      <Sidebar />
      <TopBar />

      <div
        style={{
          marginLeft: 316,
          paddingTop: 82,
          minHeight: "100vh",
          background: "#E8E8E8",
        }}
      >
        <div
          style={{
            width: 1100,
            minHeight: 1681,
            borderRadius: 32,
            padding: 20,
            gap: 12,
            background: "#5E5E5E",
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
          }}
        >
          <div
            style={{
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
            }}
          >
            <p
              style={{
                fontFamily: BG,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: "140%",
                letterSpacing: "-0.04em",
                color: "white",
                margin: 0,
                flex: 1,
              }}
            >
              Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade{" "}
              <span style={{ color: "#FCD34D" }}>{metadata.gradeLevel}</span>{" "}
              <span style={{ color: "#FCD34D" }}>{metadata.subject}</span>{" "}
              classes on the NCERT chapters:
            </p>

            <button
              onClick={onDownload}
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

          <div
            id="paper-document-desktop"
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

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontFamily: INTER, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
                  <strong>Time Allowed:</strong> <span style={{ fontWeight: 400 }}>{metadata.duration}</span>
                </span>
                <span style={{ fontFamily: INTER, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
                  <strong>Maximum Marks:</strong> <span style={{ fontWeight: 400 }}>{metadata.totalMarks}</span>
                </span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
            </div>

            <div>
              <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                All questions are compulsory unless stated otherwise.
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(["Name", "Roll Number"] as const).map((label) => (
                <p key={label} style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", color: "#303030", margin: 0 }}>
                  {label}:{" "}
                  <span style={{ display: "inline-block", width: label === "Name" ? 180 : 140, borderBottom: "1.5px solid #303030", height: 18, verticalAlign: "bottom" }} />
                </p>
              ))}
              <p style={{ fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: "160%", color: "#303030", margin: 0 }}>
                Class: {metadata.gradeLevel} &nbsp; Section:{" "}
                <span style={{ display: "inline-block", width: 100, borderBottom: "1.5px solid #303030", height: 18, verticalAlign: "bottom" }} />
              </p>
            </div>

            {sections.map((section, sectionIndex) => (
              <div key={`${section.title}-${sectionIndex}`} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h2 style={{ fontFamily: INTER, fontWeight: 600, fontSize: 24, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", textAlign: "center", margin: 0 }}>
                  {section.title}
                </h2>
                <p style={{ fontFamily: INTER, fontWeight: 400, fontStyle: "italic", fontSize: 16, lineHeight: "160%", color: "#303030", margin: 0 }}>
                  {section.instruction}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {section.questions.map((question) => (
                    <div key={question.id} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <p style={{ fontFamily: INTER, fontWeight: 400, fontSize: 16, lineHeight: "240%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                        <span style={{ fontWeight: 700 }}>{question.id}.</span>{" "}
                        <span style={{ fontWeight: 600, color: diffColor(question.difficulty), fontSize: 13, padding: "1px 6px", borderRadius: 4, background: `${diffColor(question.difficulty)}18`, marginRight: 4 }}>
                          [{diffLabel(question.difficulty)}]
                        </span>
                        {question.text}{" "}
                        <span style={{ color: "#6B7280", fontSize: 14 }}>
                          [{question.marks} Mark{question.marks !== 1 ? "s" : ""}]
                        </span>
                      </p>
                      {(question.type === "mcq" || question.type === "true-false") && question.options.length > 0 && (
                        <div style={{ paddingLeft: 36, display: "flex", flexDirection: "column", gap: 0 }}>
                          {question.options.map((option, index) => (
                            <p key={index} style={{ fontFamily: INTER, fontSize: 15, color: "#303030", margin: 0, lineHeight: "200%" }}>
                              {option}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 16, lineHeight: "240%", color: "#303030", textAlign: "center", margin: "8px 0 0 0", borderTop: "1px solid #E5E7EB", paddingTop: 12 }}>
              *** End of Question Paper ***
            </p>

            <div style={{ marginTop: 8 }}>
              <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, lineHeight: "240%", letterSpacing: "-0.04em", color: "#303030", margin: 0 }}>
                Answer Key:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {allQuestions.map((question) => (
                  <p key={question.id} style={{ fontFamily: INTER, fontWeight: 400, fontSize: 16, lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", margin: 0, whiteSpace: "pre-line" }}>
                    {question.id}.{"  "}Answer to be filled by teacher.
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobilePaper({
  paper,
  allQuestions,
  answerMap,
  onDownload,
}: {
  paper: PaperData;
  allQuestions: Question[];
  answerMap: Map<number, string>;
  onDownload: () => void;
}) {
  const { metadata, sections } = paper;
  let questionNumber = 1;

  return (
    <main
      className="sm:hidden flex justify-center"
      style={{
        width: "100%",
        marginTop: "86px",
        paddingBottom: "80px",
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <div style={{ width: "373px", margin: "0 auto", borderRadius: "40px", padding: "9px", gap: "10px", background: "white", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "355px", borderRadius: "32px", padding: "24px 16px", gap: "12px", background: "#303030", boxShadow: "0px 32px 48px rgba(0,0,0,0.2), 0px 16px 48px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "323px", gap: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontFamily: BG, fontWeight: 700, fontSize: "14px", lineHeight: "100%", letterSpacing: "-0.04em", color: "#F0F0F0", flex: 1 }}>
              Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade {metadata.gradeLevel} {metadata.subject} classes on the NCERT chapters:
            </p>
            <button type="button" onClick={onDownload} style={{ width: "36px", height: "36px", borderRadius: "100px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "none", padding: 0 }} aria-label="Download PDF">
              <Download style={{ width: "20px", height: "20px", color: "#303030" }} />
            </button>
          </div>
        </div>

        <div id="paper-document" style={{ width: "355px", borderRadius: "32px", padding: "24px 16px", gap: "24px", background: "#F6F6F6", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "323px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <h1 style={{ margin: 0, fontFamily: INTER, fontWeight: 700, fontSize: "20px", lineHeight: "130%", letterSpacing: "-0.04em", color: "#303030" }}>
              VedaAI School
            </h1>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "16px", lineHeight: "130%", letterSpacing: "-0.04em", color: "#303030" }}>
              Subject: {metadata.subject}
            </p>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "16px", lineHeight: "130%", letterSpacing: "-0.04em", color: "#303030" }}>
              Class: {metadata.gradeLevel}
            </p>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
          </div>

          <div style={{ width: "323px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
              Time Allowed: {metadata.duration}
            </div>
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
              Maximum Marks: {metadata.totalMarks}
            </div>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #E5E7EB", margin: "0" }} />
          </div>

          <div style={{ width: "323px" }}>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030" }}>
              All questions are compulsory unless stated otherwise.
            </p>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0 0 0" }} />
          </div>

          <div style={{ width: "323px", display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", color: "#303030" }}>
              Name: <span style={{ display: "inline-block", width: "120px", borderBottom: "1.5px solid #303030", height: "16px", verticalAlign: "bottom" }} />
            </p>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", color: "#303030" }}>
              Roll Number: <span style={{ display: "inline-block", width: "100px", borderBottom: "1.5px solid #303030", height: "16px", verticalAlign: "bottom" }} />
            </p>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", color: "#303030" }}>
              Class: {metadata.gradeLevel} Section:{" "}
              <span style={{ display: "inline-block", width: "80px", borderBottom: "1.5px solid #303030", height: "16px", verticalAlign: "bottom" }} />
            </p>
          </div>

          {sections.map((section, sectionIndex) => {
            const parsed = splitSectionTitle(section.title);
            const sectionLabel = parsed.label || getFallbackLabel(section.title);

            return (
              <div key={`${section.title}-${sectionIndex}`} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h2 style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "16px", lineHeight: "160%", letterSpacing: "-0.04em", color: "#303030", textAlign: "center" }}>
                  {parsed.title}
                </h2>
                <p style={{ margin: 0, fontFamily: INTER, fontWeight: 600, fontSize: "14px", lineHeight: "160%", color: "#303030" }}>
                  {sectionLabel}
                </p>
                <p style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontStyle: "italic", fontSize: "14px", lineHeight: "160%", color: "#303030" }}>
                  {section.instruction}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {section.questions.map((question) => {
                    const currentNumber = question.id ?? questionNumber++;
                    questionNumber = Math.max(questionNumber, currentNumber + 1);
                    const showOptions = (question.type === "mcq" || question.type === "true-false") && question.options.length > 0;

                    return (
                      <div key={question.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontSize: "16px", lineHeight: "150%", letterSpacing: "-0.04em", color: "#303030" }}>
                          {currentNumber}.{" "}
                          <span style={{ fontWeight: 600, color: diffColor(question.difficulty) }}>[{diffLabel(question.difficulty)}]</span>{" "}
                          {question.text} <span style={{ color: "#6B7280" }}>[{question.marks} Marks]</span>
                        </p>
                        {showOptions && (
                          <div style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "2px" }}>
                            {question.options.map((option, index) => (
                              <p key={index} style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontSize: "14px", lineHeight: "150%", letterSpacing: "-0.04em", color: "#303030" }}>
                                {String.fromCharCode(97 + index)}) {stripOptionLabel(option)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p style={{ margin: "16px 0 0 0", fontFamily: INTER, fontWeight: 700, fontSize: "16px", lineHeight: "150%", color: "#303030", textAlign: "center" }}>
            End of Question Paper
          </p>

          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ margin: 0, fontFamily: INTER, fontWeight: 700, fontSize: "16px", lineHeight: "150%", letterSpacing: "-0.04em", color: "#303030" }}>
              Answer Key:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allQuestions.map((question) => {
                const answer = answerMap.get(question.id) ?? "Answer to be filled by teacher.";
                const isBlockAnswer = answer.includes("\n");
                return (
                  <p key={question.id} style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontSize: "16px", lineHeight: "150%", letterSpacing: "-0.04em", color: "#303030", whiteSpace: isBlockAnswer ? "pre-line" : "normal" }}>
                    {question.id}.{" "}
                    <span style={{ display: "inline-block", paddingLeft: "16px", whiteSpace: isBlockAnswer ? "pre-line" : "normal", fontSize: isBlockAnswer ? "14px" : "16px" }}>
                      {answer}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaperPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [paper, setPaper] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get<{ paper: PaperData }>(`/api/papers/${id}`)
      .then((res) => {
        if (!active) return;
        setPaper(res.data.paper);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        const msg =
          err?.response?.data?.error ??
          err?.message ??
          "An unknown error occurred.";
        setError(String(msg));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const allQuestions = useMemo(() => paper?.sections.flatMap((section) => section.questions) ?? [], [paper]);
  const answerMap = useMemo(() => {
    const map = new Map<number, string>();
    paper?.answerKey?.forEach((entry) => {
      map.set(entry.questionNumber, entry.answer);
    });
    return map;
  }, [paper]);

  const handleDownload = () => {
    window.print();
  };

  const handleRegenerate = async () => {
    if (!paper) return;
    setRegenerating(true);
    try {
      await api.post(`/api/assignments/${paper.assignmentId}/regenerate`);
      router.push("/create");
    } catch {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="hidden sm:block">
          <Sidebar />
          <TopBar />
          <LoadingState />
        </div>
        <div className="sm:hidden min-h-screen bg-[#CECECE]">
          <MobileNavbar />
          <LoadingState mobile />
        </div>
      </>
    );
  }

  if (error || !paper) {
    return (
      <>
        <div className="hidden sm:block">
          <Sidebar />
          <TopBar />
          <ErrorState message={error ?? "Paper not found"} onBack={() => router.push("/assignments")} />
        </div>
        <div className="sm:hidden min-h-screen bg-[#CECECE]">
          <MobileNavbar />
          <ErrorState mobile message={error ?? "Paper not found"} onBack={() => router.push("/assignments")} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #paper-document, #paper-document *,
          #paper-document-desktop, #paper-document-desktop * { visibility: visible; }
          #paper-document,
          #paper-document-desktop {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border-radius: 0;
          }
        }
      `}</style>

      <DesktopPaper paper={paper} allQuestions={allQuestions} onDownload={handleDownload} />

      <div
        className="sm:hidden relative min-h-screen overflow-x-hidden flex flex-col"
        style={{
          width: "100vw",
          minHeight: "100vh",
          background: "#CECECE",
          padding: 0,
        }}
      >
        <MobileNavbar />
        <MobilePaper paper={paper} allQuestions={allQuestions} answerMap={answerMap} onDownload={handleDownload} />

        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between"
          style={{
            height: "64px",
            background: "white",
            borderTop: "1px solid #F0F0F0",
            padding: "0 16px",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center justify-center"
            style={{
              height: "36px",
              padding: "0 16px",
              borderRadius: "100px",
              border: "1px solid #E5E7EB",
              background: "white",
              color: "#374151",
              fontSize: "13px",
              fontFamily: BG,
              gap: "6px",
              opacity: regenerating ? 0.6 : 1,
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {regenerating ? "Regenerating..." : "Regenerate"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center"
            style={{
              height: "36px",
              padding: "0 16px",
              borderRadius: "100px",
              border: "none",
              background: "#181818",
              color: "white",
              fontSize: "13px",
              fontFamily: BG,
              gap: "6px",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}
