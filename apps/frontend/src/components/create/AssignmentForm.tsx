"use client";

import React, { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Mic, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { FileUpload } from "./FileUpload";
import { GeneratingModal } from "./GeneratingModal";
import { useAssignmentStore } from "@/store/assignmentStore";
import api from "@/lib/api";

// ─── Constants ───────────────────────────────────────────────────────────────

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False Questions",
] as const;

const TYPE_LABEL_TO_ENUM: Record<string, "mcq" | "short" | "long" | "true-false"> = {
  "Multiple Choice Questions": "mcq",
  "Short Questions": "short",
  "Long Answer Questions": "long",
  "True/False Questions": "true-false",
  "Diagram/Graph-Based Questions": "short",
  "Numerical Problems": "long",
};

function normalizeType(label: string): "mcq" | "short" | "long" | "true-false" {
  return TYPE_LABEL_TO_ENUM[label] ?? "short";
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const questionTypeRowSchema = z.object({
  id: z.string(),
  type: z.string().min(1),
  count: z.number().int().min(1).max(50),
  marks: z.number().int().min(1).max(20),
});

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (v) => { const d = new Date(v); return !isNaN(d.getTime()) && d > new Date(); },
      "Due date must be a future date"
    ),
  questionTypes: z.array(questionTypeRowSchema).min(1),
  additionalInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Desktop Counter Pill ─────────────────────────────────────────────────────

function DesktopCounterPill({
  value,
  onChange,
  min = 1,
  max = 50,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div
      className="flex-1 flex items-center justify-between select-none"
      style={{ background: "#F0F0F0", borderRadius: "100px", height: "44px", padding: "0 12px" }}
    >
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors text-lg leading-none">−</button>
      <span className="text-[13px] font-bold text-[#1A1A1A] tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors text-lg leading-none">+</button>
    </div>
  );
}

// ─── Shared pill input class (desktop) ───────────────────────────────────────

const pillCls = (err: boolean) =>
  [
    "w-full h-11 px-4 text-[13px] text-[#1A1A1A] placeholder-[#C4C4C4]",
    "focus:outline-none focus:ring-2 focus:ring-[#E8460E]/25 transition-colors border bg-white",
    err ? "border-red-400 bg-red-50" : "border-[#DADADA]",
  ].join(" ");

// ─── Component ───────────────────────────────────────────────────────────────

export function AssignmentForm() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const setAssignment = useAssignmentStore((s) => s.setAssignment);
  const setJobStatus = useAssignmentStore((s) => s.setJobStatus);
  const { assignmentId, jobStatus } = useAssignmentStore();

  React.useEffect(() => {
    if ((jobStatus === "queued" || jobStatus === "processing") && assignmentId) {
      setShowModal(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const updateViewport = () => setIsDesktop(query.matches);
    updateViewport();
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  const { register, control, handleSubmit, formState: { errors }, watch } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        subject: "",
        grade: "",
        dueDate: "",
        questionTypes: [
          { id: nanoid(), type: "Multiple Choice Questions", count: 4, marks: 1 },
          { id: nanoid(), type: "Short Questions", count: 3, marks: 2 },
          { id: nanoid(), type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
          { id: nanoid(), type: "Numerical Problems", count: 5, marks: 5 },
        ],
        additionalInstructions: "",
      },
    });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questionTypes",
    keyName: "fieldId",
  });

  const watchedQt = watch("questionTypes");
  const totalQuestions = watchedQt.reduce((s, r) => s + (r.count || 0), 0);
  const totalMarks = watchedQt.reduce((s, r) => s + (r.count || 0) * (r.marks || 0), 0);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setSubmitError(null);
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("subject", data.subject);
        formData.append("gradeLevel", data.grade);
        formData.append("dueDate", data.dueDate);
        const mappedQt = data.questionTypes.map((qt) => ({
          type: normalizeType(qt.type),
          count: qt.count,
          marksEach: qt.marks,
        }));
        formData.append("questionTypes", JSON.stringify(mappedQt));
        if (data.additionalInstructions)
          formData.append("additionalInstructions", data.additionalInstructions);
        if (uploadedFile) formData.append("file", uploadedFile);

        const response = await api.post("/api/assignments", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const { assignmentId: newId } = response.data as { assignmentId: string; jobId: string };
        setAssignment(newId);
        setJobStatus("queued");
        setShowModal(true);
      } catch (err: unknown) {
        console.error("Failed to create assignment:", err);
        const msg =
          (err as { response?: { data?: { error?: string; details?: unknown } } })?.response?.data?.error ||
          (err as { message?: string })?.message ||
          "Something went wrong. Please try again.";
        setSubmitError(String(msg));
      }
    },
    [uploadedFile, setAssignment, setJobStatus]
  );

  const handleRetry = useCallback(() => {
    setShowModal(false);
    setJobStatus("idle");
  }, [setJobStatus]);

  const addQuestionType = useCallback(() => {
    append({ id: nanoid(), type: QUESTION_TYPE_OPTIONS[0], count: 1, marks: 1 });
  }, [append]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Mobile counter block helper
  // ─────────────────────────────────────────────────────────────────────────────
  const mobileCounter = (
    label: string,
    value: number,
    dec: () => void,
    inc: () => void
  ) => (
    <div className="flex-1 flex flex-col gap-2">
      <span
        className="text-center font-medium text-[14px] text-[#303030]"
        style={{ letterSpacing: "-0.04em" }}
      >
        {label}
      </span>
      <div className="flex items-center justify-between bg-white rounded-full px-3 select-none"
        style={{ height: "38px" }}>
        <button type="button" onClick={dec}
          className="text-[#6B7280] hover:text-[#1A1A1A] text-xl leading-none w-6 h-6 flex items-center justify-center">−</button>
        <span className="font-bold text-[13px] text-[#1A1A1A] tabular-nums">{value}</span>
        <button type="button" onClick={inc}
          className="text-[#6B7280] hover:text-[#1A1A1A] text-xl leading-none w-6 h-6 flex items-center justify-center">+</button>
      </div>
    </div>
  );

  return (
    <>
      <GeneratingModal isOpen={showModal} onRetry={handleRetry} />

      <form id="create-assignment-form" onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE CARD  (sm:hidden — shown only on < 640px)
        ══════════════════════════════════════════════════════════════ */}
        {!isDesktop && (
          <div
            className="sm:hidden w-full rounded-2xl flex flex-col gap-6"
            style={{ background: "rgba(255,255,255,0.5)", padding: "32px 16px" }}
          >

          {/* ── Header block ── */}
          <div className="flex flex-col gap-0.5">
            <h2
              className="font-bold text-[#303030]"
              style={{ fontSize: "20px", lineHeight: "140%", letterSpacing: "-0.04em" }}
            >
              Assignment Details
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(94,94,94,0.8)" }}>
              Basic information about your assignment
            </p>
          </div>

          {/* ── Title ── */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Chapter 5 – Forces and Motion"
              className={pillCls(!!errors.title)}
              style={{ borderRadius: "100px", borderWidth: "1.25px", fontSize: "15px" }}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* ── Subject + Grade ── */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                {...register("subject")}
                placeholder="e.g. Physics"
                className={pillCls(!!errors.subject)}
                style={{ borderRadius: "100px", borderWidth: "1.25px", fontSize: "15px" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                Grade / Class <span className="text-red-500">*</span>
              </label>
              <select
                {...register("grade")}
                className={[pillCls(!!errors.grade), "appearance-none"].join(" ")}
                style={{ borderRadius: "100px", borderWidth: "1.25px", fontSize: "15px" }}
              >
                <option value="">Select grade</option>
                {["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
                  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── 2a: File upload ── */}
          <FileUpload value={uploadedFile} onChange={setUploadedFile} mobile />

          {/* ── 2b: Due Date ── */}
          <div className="flex flex-col gap-2">
            <label
              className="font-bold text-[#303030]"
              style={{ fontSize: "16px", letterSpacing: "-0.04em" }}
            >
              Due Date
            </label>
            <div className="relative">
              <input
                {...register("dueDate")}
                type="date"
                className="w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E8460E]/25 transition-colors pr-10"
                style={{
                  height: "44px",
                  borderRadius: "100px",
                  border: `1.25px solid ${errors.dueDate ? "#f87171" : "#DADADA"}`,
                  padding: "11px 16px",
                  fontSize: "16px",
                  color: "#A9A9A9",
                }}
              />
              <svg
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9CA3AF]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>

          {/* ── 2c: Question Type block ── */}
          <div className="flex flex-col gap-4">
            <label
              className="font-bold text-[#303030]"
              style={{ fontSize: "16px", letterSpacing: "-0.04em" }}
            >
              Question Type
            </label>

            {/* Question cards */}
            {fields.map((field, index) => {
              const row = watchedQt[index];
              return (
                <div
                  key={field.fieldId}
                  className="bg-white flex flex-col gap-3"
                  style={{ borderRadius: "12px", padding: "12px" }}
                >
                  {/* Top row: type dropdown + × */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative flex-1">
                      <select
                        value={row?.type || ""}
                        onChange={(e) => row && update(index, { ...row, type: e.target.value })}
                        className="w-full appearance-none bg-transparent font-semibold text-[#303030] focus:outline-none cursor-pointer pr-6"
                        style={{ fontSize: "14px", letterSpacing: "-0.04em" }}
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]"
                      />
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:opacity-50 transition-opacity"
                      >
                        <X className="w-4 h-4 text-[#9CA3AF]" />
                      </button>
                    )}
                  </div>

                  {/* Counter block: gray rounded pill with both counters */}
                  <div
                    className="flex gap-3 p-2"
                    style={{ background: "#F0F0F0", borderRadius: "24px", height: "82px" }}
                  >
                    {mobileCounter(
                      "No. of Questions",
                      row?.count ?? 1,
                      () => row && update(index, { ...row, count: Math.max(1, row.count - 1) }),
                      () => row && update(index, { ...row, count: Math.min(50, row.count + 1) })
                    )}
                    {mobileCounter(
                      "Marks",
                      row?.marks ?? 1,
                      () => row && update(index, { ...row, marks: Math.max(1, row.marks - 1) }),
                      () => row && update(index, { ...row, marks: Math.min(20, row.marks + 1) })
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Question Type button */}
            <button
              type="button"
              onClick={addQuestionType}
              className="flex items-center gap-2 w-fit"
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: "36px", height: "36px", background: "#2B2B2B", borderRadius: "8px" }}
              >
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-[#303030]"
                style={{ fontSize: "14px", letterSpacing: "-0.04em" }}
              >
                Add Question Type
              </span>
            </button>

            {/* Totals */}
            <div className="flex flex-col items-end gap-0.5">
              <span
                className="font-medium text-[#303030]"
                style={{ fontSize: "16px", letterSpacing: "-0.04em", lineHeight: "110%" }}
              >
                Total Questions : {totalQuestions}
              </span>
              <span
                className="font-medium text-[#303030]"
                style={{ fontSize: "16px", letterSpacing: "-0.04em", lineHeight: "110%" }}
              >
                Total Marks : {totalMarks}
              </span>
            </div>
          </div>

          {/* ── Additional Information ── */}
          <div className="flex flex-col gap-2">
            <label
              className="font-bold text-[14px] text-[#303030]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Additional Information{" "}
              <span className="font-normal text-[#9CA3AF]">(For better output)</span>
            </label>
            <div className="relative">
              <textarea
                {...register("additionalInstructions")}
                rows={4}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full border border-[#DADADA] px-4 py-3 pr-10 text-[13px] text-[#1A1A1A] placeholder-[#C4C4C4] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8460E]/25 transition-colors"
                style={{ borderRadius: "12px" }}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-[#9CA3AF] hover:text-[#E8460E] transition-colors"
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          </div>
        )}{/* end MOBILE CARD */}


        {/* ══════════════════════════════════════════════════════════════
            DESKTOP CARD  (hidden sm:flex — shown only on ≥ 640px)
        ══════════════════════════════════════════════════════════════ */}
        {isDesktop && (
          <div
            className="hidden sm:flex w-full max-w-[810px] mx-auto rounded-2xl flex-col"
            style={{ background: "rgba(255,255,255,0.5)", padding: "32px", gap: "32px" }}
          >

          {/* Section 1: Header */}
          <div className="flex flex-col" style={{ gap: "2px" }}>
            <h2
              className="font-bold text-[#303030]"
              style={{ fontSize: "20px", lineHeight: "140%", letterSpacing: "-0.04em" }}
            >
              Assignment Details
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(94,94,94,0.8)" }}>
              Basic information about your assignment
            </p>
          </div>

          {/* Section 2: Fields */}
          <div className="flex flex-col" style={{ gap: "16px" }}>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Chapter 5 – Forces and Motion"
                className={pillCls(!!errors.title)}
                style={{ borderRadius: "100px", borderWidth: "1.25px" }}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            {/* Subject + Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subject")}
                  placeholder="e.g. Physics"
                  className={pillCls(!!errors.subject)}
                  style={{ borderRadius: "100px", borderWidth: "1.25px" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                  Grade / Class <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("grade")}
                  className={[pillCls(!!errors.grade), "appearance-none"].join(" ")}
                  style={{ borderRadius: "100px", borderWidth: "1.25px" }}
                >
                  <option value="">Select grade</option>
                  {["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
                    "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload */}
            <FileUpload value={uploadedFile} onChange={setUploadedFile} />

            {/* Due Date */}
            <div className="flex flex-col gap-2">
              <label
                className="font-bold text-[#303030]"
                style={{ fontSize: "16px", letterSpacing: "-0.04em" }}
              >
                Due Date
              </label>
              <div className="relative">
                <input
                  {...register("dueDate")}
                  type="date"
                  className="w-full h-11 px-4 pr-11 text-[13px] text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#E8460E]/25 transition-colors"
                  style={{
                    borderRadius: "100px",
                    border: `1.25px solid ${errors.dueDate ? "#f87171" : "#DADADA"}`,
                  }}
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>

            {/* Question Types — CSS grid (471px | 1fr) */}
            <div className="flex flex-col" style={{ gap: "16px" }}>
              {/* Header row */}
              <div
                className="grid items-center"
                style={{ gridTemplateColumns: "471px 1fr", gap: "16px" }}
              >
                <span className="font-bold text-[#303030] flex items-center h-11"
                  style={{ fontSize: "16px", letterSpacing: "-0.04em" }}>
                  Question Type
                </span>
                <div className="flex gap-3 h-11 items-center">
                  <span className="flex-1 text-center text-[14px] font-bold text-[#303030]">No. of Questions</span>
                  <span className="flex-1 text-center text-[14px] font-bold text-[#303030]">Marks</span>
                </div>
              </div>

              {/* Data rows */}
              <div className="flex flex-col" style={{ gap: "16px" }}>
                {fields.map((field, index) => {
                  const row = watchedQt[index];
                  return (
                    <div
                      key={field.fieldId}
                      className="grid items-center"
                      style={{ gridTemplateColumns: "471px 1fr", gap: "16px" }}
                    >
                      {/* Left: dropdown + × */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1" style={{ maxWidth: "443px" }}>
                          <select
                            value={row?.type || ""}
                            onChange={(e) => row && update(index, { ...row, type: e.target.value })}
                            className="w-full h-11 appearance-none rounded-lg border border-[#E5E7EB] bg-white px-3 pr-8 text-[13px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#E8460E]/30 focus:border-[#E8460E] cursor-pointer"
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
                        {fields.length > 1 ? (
                          <button type="button" onClick={() => remove(index)}
                            className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:opacity-50 transition-opacity">
                            <X className="w-4 h-4 text-[#9CA3AF]" />
                          </button>
                        ) : <div className="w-5 flex-shrink-0" />}
                      </div>

                      {/* Right: counters */}
                      <div className="flex gap-3">
                        <DesktopCounterPill
                          value={row?.count ?? 1}
                          onChange={(v) => row && update(index, { ...row, count: v })}
                          min={1} max={50}
                        />
                        <DesktopCounterPill
                          value={row?.marks ?? 1}
                          onChange={(v) => row && update(index, { ...row, marks: v })}
                          min={1} max={20}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add button */}
              <button type="button" onClick={addQuestionType} className="flex items-center gap-2.5 w-fit">
                <span className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-white" />
                </span>
                <span className="text-[14px] font-semibold text-[#1A1A1A]">Add Question Type</span>
              </button>

              {/* Totals */}
              <div className="flex flex-col items-end gap-0.5 pt-2 border-t border-[#F0F0F0]">
                <p className="text-[13px] text-[#374151]">
                  <span className="text-[#6B7280]">Total Questions : </span>
                  <span className="font-semibold">{totalQuestions}</span>
                </p>
                <p className="text-[13px] text-[#374151]">
                  <span className="text-[#6B7280]">Total Marks : </span>
                  <span className="font-semibold">{totalMarks}</span>
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-[14px] text-[#303030]" style={{ letterSpacing: "-0.04em" }}>
                Additional Information{" "}
                <span className="font-normal text-[#9CA3AF]">(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  {...register("additionalInstructions")}
                  rows={4}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="w-full border border-[#DADADA] px-4 py-3 pr-10 text-[13px] text-[#1A1A1A] placeholder-[#C4C4C4] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8460E]/25 focus:border-[#E8460E] transition-colors"
                  style={{ borderRadius: "12px" }}
                />
                <button type="button"
                  className="absolute right-3 bottom-3 text-[#9CA3AF] hover:text-[#E8460E] transition-colors"
                  aria-label="Voice input">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>{/* end fields */}
          </div>
        )}{/* end DESKTOP CARD */}

        {/* Error banner — shown when submission fails */}
        {submitError && (
          <div className="w-full max-w-[810px] mx-auto mt-4 px-4 py-3 rounded-xl text-sm font-medium text-red-700 flex items-center gap-2"
            style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
              <path d="M8 5v3.5M8 11h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {submitError}
          </div>
        )}

        {/* Desktop footer — hidden on mobile (mobile footer is in create/page.tsx) */}
        {isDesktop && (
        <div className="hidden sm:flex w-full max-w-[810px] mx-auto items-center justify-between pt-6 pb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white text-[14px] font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            style={{ borderRadius: "100px", border: "1.5px solid #E5E7EB", padding: "12px 24px" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1A1A1A] text-white text-[14px] font-semibold hover:bg-[#333333] transition-colors"
            style={{ borderRadius: "100px", padding: "12px 28px" }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        )}

      </form>
    </>
  );
}
