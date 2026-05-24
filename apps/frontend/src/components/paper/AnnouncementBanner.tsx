"use client";

import React from "react";
import { Download } from "lucide-react";

interface AnnouncementBannerProps {
  message: string;
  onDownload: () => void;
}

export function AnnouncementBanner({
  message,
  onDownload,
}: AnnouncementBannerProps) {
  return (
    <div className="bg-[#1A1A1A] px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-white text-sm sm:text-[15px] leading-relaxed font-normal max-w-xl">
        {message}
      </p>
      <button
        onClick={onDownload}
        className="flex-shrink-0 flex items-center gap-2 border border-white/70 text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-white/10 transition-colors w-fit"
      >
        <Download className="w-4 h-4" />
        Download as PDF
      </button>
    </div>
  );
}
