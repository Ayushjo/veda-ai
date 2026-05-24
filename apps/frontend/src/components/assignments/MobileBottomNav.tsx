"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, BookOpen, Sparkles } from "lucide-react";

const MOBILE_NAV = [
  { label: "Home", icon: LayoutGrid, href: "/" },
  { label: "Assignments", icon: FileText, href: "/assignments" },
  { label: "Library", icon: BookOpen, href: "/library" },
  { label: "AI Toolkit", icon: Sparkles, href: "/toolkit" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-4 pt-2 bg-transparent">
      <div className="bg-[#1A1A1A] rounded-2xl px-2 py-2 flex items-center justify-around">
        {MOBILE_NAV.map(({ label, icon: Icon, href }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors"
            >
              {/* Active icon gets white filled bg pill */}
              <div
                className={[
                  "flex items-center justify-center w-8 h-8 rounded-xl transition-colors",
                  isActive ? "bg-white" : "bg-transparent",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "w-4.5 h-4.5",
                    isActive ? "text-[#1A1A1A]" : "text-[#9CA3AF]",
                  ].join(" ")}
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <span
                className={[
                  "text-[10px] leading-none",
                  isActive
                    ? "text-white font-bold"
                    : "text-[#9CA3AF] font-normal",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
