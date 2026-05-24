"use client";

import React from "react";
import { X } from "lucide-react";

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False Questions",
] as const;

export type QuestionTypeOption = (typeof QUESTION_TYPE_OPTIONS)[number];

export interface QuestionTypeRowData {
  id: string;
  type: QuestionTypeOption | string;
  count: number;
  marks: number;
}

interface QuestionTypeRowProps {
  row: QuestionTypeRowData;
  onChange: (updated: QuestionTypeRowData) => void;
  onRemove: () => void;
  canRemove: boolean;
  countError?: string;
  marksError?: string;
}

// Shared grid template — must match the header row in AssignmentForm
export const QT_GRID = "1fr 24px 120px 100px";

function CounterInput({
  value,
  onChange,
  min = 1,
  max = 50,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={[
          "flex items-center justify-between rounded-full bg-[#F0F0F0] h-9 px-2.5 w-full",
          error ? "ring-1 ring-red-400" : "",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-5 h-5 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors text-base leading-none select-none flex-shrink-0"
          aria-label="decrease"
        >
          −
        </button>
        <span className="text-[13px] font-semibold text-[#1A1A1A] tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-5 h-5 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors text-base leading-none select-none flex-shrink-0"
          aria-label="increase"
        >
          +
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function QuestionTypeRow({
  row,
  onChange,
  onRemove,
  canRemove,
  countError,
  marksError,
}: QuestionTypeRowProps) {
  return (
    <>
      {/* ── Desktop: CSS grid aligned with header ── */}
      <div
        className="hidden sm:grid items-center gap-x-3"
        style={{ gridTemplateColumns: QT_GRID }}
      >
        {/* Col 1: Dropdown — full width, no truncation */}
        <div className="relative">
          <select
            value={row.type}
            onChange={(e) => onChange({ ...row, type: e.target.value })}
            className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white h-11 px-3 pr-8 text-[13px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#E8460E]/30 focus:border-[#E8460E] cursor-pointer"
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Col 2: × remove button */}
        <div className="flex items-center justify-center">
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="w-5 h-5 flex items-center justify-center hover:opacity-50 transition-opacity"
              aria-label="Remove question type"
            >
              <X className="w-4 h-4" style={{ color: "#303030" }} />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Col 3: No. of Questions counter */}
        <CounterInput
          value={row.count}
          onChange={(v) => onChange({ ...row, count: v })}
          min={1}
          max={50}
          error={countError}
        />

        {/* Col 4: Marks counter */}
        <CounterInput
          value={row.marks}
          onChange={(v) => onChange({ ...row, marks: v })}
          min={1}
          max={20}
          error={marksError}
        />
      </div>

      {/* ── Mobile: card style ── */}
      <div className="sm:hidden rounded-xl border border-[#E5E7EB] bg-white p-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <select
              value={row.type}
              onChange={(e) => onChange({ ...row, type: e.target.value })}
              className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1A1A1A] pr-8 focus:outline-none cursor-pointer"
            >
              {QUESTION_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="w-6 h-6 flex items-center justify-center hover:opacity-50 transition-opacity"
            >
              <X className="w-4 h-4" style={{ color: "#303030" }} />
            </button>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-[#6B7280] font-medium">No. of Questions</span>
            <CounterInput
              value={row.count}
              onChange={(v) => onChange({ ...row, count: v })}
              min={1}
              max={50}
              error={countError}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-[#6B7280] font-medium">Marks</span>
            <CounterInput
              value={row.marks}
              onChange={(v) => onChange({ ...row, marks: v })}
              min={1}
              max={20}
              error={marksError}
            />
          </div>
        </div>
      </div>
    </>
  );
}
