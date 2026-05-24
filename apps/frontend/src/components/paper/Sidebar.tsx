"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Wand2,
  BookOpen,
  Settings,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: LayoutGrid, href: "/" },
  { label: "My Groups", icon: Users, href: "/groups" },
  { label: "Assignments", icon: FileText, href: "/assignments", badge: 32 },
  { label: "AI Teacher's Toolkit", icon: Wand2, href: "/toolkit" },
  { label: "My Library", icon: BookOpen, href: "/library" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[192px] min-h-screen bg-white border-r border-[#F0F0F0] fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm leading-none">V</span>
        </div>
        <span className="text-[#1A1A1A] font-semibold text-[15px] leading-tight">
          VedaAI
        </span>
      </div>

      {/* AI Teacher's Toolkit CTA */}
      <div className="px-3 mb-4">
        <button className="w-full flex items-center justify-center gap-1.5 bg-[#E8460E] hover:bg-[#d03e0c] transition-colors text-white text-xs font-semibold rounded-full py-2 px-3">
          <Plus className="w-3.5 h-3.5" />
          AI Teacher&apos;s Toolkit
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href, badge }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-[#F4F6FA] text-[#1A1A1A] font-medium"
                  : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1A1A1A]",
              ].join(" ")}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 leading-tight">{label}</span>
              {badge !== undefined && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1A1A1A] transition-colors"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>Settings</span>
        </Link>

        {/* School card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] mt-1">
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* School shield icon placeholder */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-6 h-6"
            >
              <path
                d="M16 4L6 9v7c0 5.25 4.27 10.16 10 11.33C21.73 26.16 26 21.25 26 16V9L16 4z"
                fill="#D1D5DB"
                stroke="#9CA3AF"
                strokeWidth="1.5"
              />
              <path
                d="M12 16l2.5 2.5L20 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[#1A1A1A] text-xs font-semibold leading-tight truncate">
              Delhi Public School
            </span>
            <span className="text-[#9CA3AF] text-[10px] leading-tight truncate">
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
