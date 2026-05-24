import React from "react";

export interface Question {
  id: number;
  text: string;
  type: "mcq" | "short" | "long" | "true-false";
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  options?: string[];
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Moderate",
  hard: "Challenging",
};

const DIFFICULTY_CLASS: Record<string, string> = {
  easy: "text-[#16A34A]",
  medium: "text-[#D97706]",
  hard: "text-[#DC2626]",
};

interface QuestionItemProps {
  question: Question;
  index: number;
}

export function QuestionItem({ question, index }: QuestionItemProps) {
  const diffLabel = DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty;
  const diffClass = DIFFICULTY_CLASS[question.difficulty] ?? "text-[#6B7280]";

  return (
    <li className="flex gap-1.5 text-sm text-[#1A1A1A] leading-relaxed">
      <span className="flex-shrink-0 font-normal">{index + 1}.</span>
      <span>
        <span className={`font-normal ${diffClass}`}>[{diffLabel}]</span>
        {" "}
        <span>{question.text}</span>
        {" "}
        <span className="text-[#6B7280]">[{question.marks} Marks]</span>
      </span>
    </li>
  );
}
