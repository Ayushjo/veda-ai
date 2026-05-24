import React from "react";
import { QuestionItem, type Question } from "./QuestionItem";

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface SectionBlockProps {
  section: Section;
  questionOffset: number; // for global question numbering
}

export function SectionBlock({ section, questionOffset }: SectionBlockProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Section heading — centered, bold */}
      <h3 className="text-center text-[15px] font-semibold text-[#1A1A1A]">
        {section.title}
      </h3>

      {/* Subsection type label */}
      <p className="text-sm font-bold text-[#1A1A1A]">
        {/* Derive a readable label from section title if no explicit label */}
        {section.title.toLowerCase().includes("a")
          ? "Short Answer Questions"
          : section.title.toLowerCase().includes("b")
          ? "Long Answer Questions"
          : "Questions"}
      </p>

      {/* Italic instruction */}
      <p className="text-sm italic text-[#374151]">{section.instruction}</p>

      {/* Questions */}
      <ol className="flex flex-col gap-2 list-none p-0 m-0">
        {section.questions.map((q, i) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={questionOffset + i}
          />
        ))}
      </ol>
    </div>
  );
}
