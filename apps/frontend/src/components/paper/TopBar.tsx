"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, ChevronDown, Sparkles, Menu } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-[#F0F0F0] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#6B7280] hover:bg-[#F4F6FA] transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <Link
          href="/create"
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Create New</span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F6FA] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
        </button>

        {/* User dropdown */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#F4F6FA] transition-colors"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
              <circle cx="14" cy="14" r="14" fill="#E5E7EB" />
              <circle cx="14" cy="11" r="4.5" fill="#9CA3AF" />
              <path
                d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#1A1A1A]">
            John Doe
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F6FA] transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
