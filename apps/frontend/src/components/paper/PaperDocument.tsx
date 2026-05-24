import React from "react";
import { SectionBlock, type Section } from "./SectionBlock";

export interface PaperMetadata {
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  dueDate: string;
}

export interface AnswerKeyEntry {
  questionNumber: number;
  answer: string;
}

export interface PaperData {
  _id: string;
  metadata: PaperMetadata;
  sections: Section[];
  schoolName?: string;
  answerKey?: AnswerKeyEntry[];
}

interface PaperDocumentProps {
  paper: PaperData;
}

// Blank line component — underlined span matching Figma student fill-in style
function BlankLine({ width = "w-36" }: { width?: string }) {
  return (
    <span
      className={`inline-block ${width} border-b border-[#1A1A1A] h-4 align-bottom`}
    />
  );
}

export function PaperDocument({ paper }: PaperDocumentProps) {
  const { metadata, sections, schoolName, answerKey } = paper;

  // Compute cumulative question offsets for global numbering
  const offsets: number[] = [];
  let acc = 0;
  for (const section of sections) {
    offsets.push(acc);
    acc += section.questions.length;
  }
  const totalQuestions = acc;

  // Build answer key entries — use provided or generate placeholders
  const answerEntries: AnswerKeyEntry[] =
    answerKey && answerKey.length > 0
      ? answerKey
      : Array.from({ length: totalQuestions }, (_, i) => ({
          questionNumber: i + 1,
          answer: "Answer to be filled by teacher.",
        }));

  return (
    <div
      id="paper-document"
      className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)] border border-[#F0F0F0] px-6 sm:px-10 py-8 max-w-[700px] w-full mx-auto"
    >
      {/* ── Paper Header ─────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 mb-4 text-center">
        <h1 className="text-[18px] sm:text-xl font-bold text-[#1A1A1A] leading-snug">
          {schoolName ?? "Delhi Public School, Sector-4, Bokaro"}
        </h1>
        <p className="text-sm text-[#1A1A1A] font-normal">
          Subject: {metadata.subject}
        </p>
        <p className="text-sm text-[#1A1A1A] font-medium">
          Class: {metadata.gradeLevel}
        </p>
      </div>

      <hr className="border-[#D1D5DB] mb-3" />

      {/* Time + Marks row */}
      <div className="flex items-center justify-between text-sm text-[#1A1A1A] mb-3">
        <span>
          <span className="font-semibold">Time Allowed:</span>{" "}
          {metadata.duration}
        </span>
        <span>
          <span className="font-semibold">Maximum Marks:</span>{" "}
          {metadata.totalMarks}
        </span>
      </div>

      <hr className="border-[#D1D5DB] mb-3" />

      {/* General instruction */}
      <p className="text-sm italic text-[#1A1A1A] mb-3">
        All questions are compulsory unless stated otherwise.
      </p>

      <hr className="border-[#D1D5DB] mb-5" />

      {/* ── Student Info ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2 mb-7">
        <p className="text-sm text-[#1A1A1A]">
          Name: <BlankLine width="w-44" />
        </p>
        <p className="text-sm text-[#1A1A1A]">
          Roll Number: <BlankLine width="w-32" />
        </p>
        <p className="text-sm text-[#1A1A1A]">
          Class: {metadata.gradeLevel} Section: <BlankLine width="w-24" />
        </p>
      </div>

      {/* ── Sections ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        {sections.map((section, si) => (
          <SectionBlock
            key={si}
            section={section}
            questionOffset={offsets[si]}
          />
        ))}
      </div>

      {/* ── End of paper ─────────────────────────────────────── */}
      <p className="text-sm font-bold text-[#1A1A1A] mt-8 mb-8">
        End of Question Paper
      </p>

      {/* ── Answer Key ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-6">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Answer Key:</h3>
        <ol className="flex flex-col gap-3 list-none p-0 m-0">
          {answerEntries.map((entry) => (
            <li
              key={entry.questionNumber}
              className="flex gap-1.5 text-sm text-[#1A1A1A] leading-relaxed"
            >
              <span className="flex-shrink-0">
                {entry.questionNumber}.
              </span>
              <span>{entry.answer}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
