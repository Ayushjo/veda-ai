"use client";

import React from "react";
import { X } from "lucide-react";
import { useGenerationStatus } from "@/hooks/useGenerationStatus";
import { useAssignmentStore } from "@/store/assignmentStore";

interface GeneratingModalProps {
  isOpen: boolean;
  onRetry?: () => void;
}

export function GeneratingModal({ isOpen, onRetry }: GeneratingModalProps) {
  const { assignmentId, jobStatus } = useAssignmentStore();
  useGenerationStatus(assignmentId);

  if (!isOpen) return null;

  // ── Derived UI state ────────────────────────────────────────────────────────
  const isFailed = jobStatus === "failed";
  const isCompleted = jobStatus === "completed";

  const progressWidth =
    jobStatus === "queued"
      ? "15%"
      : jobStatus === "processing"
      ? "60%"
      : jobStatus === "completed"
      ? "100%"
      : "0%";

  // For the 'processing' state we use the CSS animation; otherwise inline width
  const useAnimation = jobStatus === "processing";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4">

        {/* ── Icon area ──────────────────────────────────────────────────────── */}
        {isFailed ? (
          // Error state — red X circle
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
        ) : (
          // Spinner with VedaAI logo
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg
              className="animate-spin w-16 h-16 text-[#E8460E]"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="88 88"
                strokeDashoffset="22"
                opacity="0.2"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="44 132"
                strokeDashoffset="22"
              />
            </svg>
            {/* VedaAI logo icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#E8460E] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                >
                  <path
                    d="M12 3L20 18H4L12 3Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ── Text area ──────────────────────────────────────────────────────── */}
        <div className="text-center flex flex-col gap-1.5">
          {isFailed ? (
            <>
              <h3 className="text-lg font-semibold text-red-600">
                Generation Failed
              </h3>
              <p className="text-sm text-red-500">
                Generation failed. Please try again.
              </p>
            </>
          ) : isCompleted ? (
            <>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Paper Ready!
              </h3>
              <p className="text-sm text-[#6B7280]">Redirecting…</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Generating Your Assignment
              </h3>
              <p className="text-sm text-[#6B7280]">
                Our AI is crafting your question paper. This may take a few
                seconds…
              </p>
            </>
          )}
        </div>

        {/* ── Progress bar ───────────────────────────────────────────────────── */}
        <div className="w-full h-1.5 rounded-full bg-[#F4F6FA] overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-700",
              isFailed ? "bg-red-400" : "bg-[#E8460E]",
              useAnimation
                ? "animate-[progress_2.5s_ease-in-out_infinite]"
                : "",
            ].join(" ")}
            style={
              useAnimation
                ? { animation: "progress 2.5s ease-in-out infinite" }
                : { width: progressWidth }
            }
          />
        </div>

        {/* ── Retry button (failed state only) ───────────────────────────────── */}
        {isFailed && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#1A1A1A] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#333333] transition-colors"
          >
            Try Again
          </button>
        )}

        <style jsx>{`
          @keyframes progress {
            0% {
              width: 0%;
            }
            50% {
              width: 70%;
            }
            100% {
              width: 90%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
