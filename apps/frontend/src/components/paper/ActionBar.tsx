"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Download } from "lucide-react";
import api from "@/lib/api";

interface ActionBarProps {
  assignmentId: string | null;
  onDownload: () => void;
}

export function ActionBar({ assignmentId, onDownload }: ActionBarProps) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!assignmentId) return;
    setIsRegenerating(true);
    try {
      await api.post(`/api/assignments/${assignmentId}/regenerate`);
      router.push("/create");
    } catch (err) {
      console.error("Regenerate failed:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0F0F0] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="md:pl-[192px] px-4 sm:px-6 py-3 flex items-center justify-end gap-3">
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating || !assignmentId}
          className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
          />
          {isRegenerating ? "Regenerating…" : "Regenerate"}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-full bg-[#1A1A1A] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#333333] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
