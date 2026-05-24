"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  /** Pass true for the mobile spec styling */
  mobile?: boolean;
}

export function FileUpload({ value, onChange, error, mobile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0] ?? null;
      if (file) onChange(file);
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      onChange(file);
    },
    [onChange]
  );

  const inputId = mobile ? "file-upload-input-mobile" : "file-upload-input";

  return (
    <div className="flex flex-col gap-3">
      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
        className={[
          "flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors",
          mobile
            ? "rounded-xl py-6 px-8"
            : "rounded-xl border-2 border-dashed py-8 px-4",
          mobile
            ? isDragging
              ? "border-[#E8460E] bg-[#FFF5F2]"
              : "bg-[#F6F6F6] hover:bg-[#F0F0F0]"
            : isDragging
            ? "border-[#E8460E] bg-[#FFF5F2]"
            : "border-[#D9D9D9] bg-white hover:border-[#E8460E] hover:bg-[#FFF5F2]",
          !mobile ? (error ? "border-red-400" : "") : "",
        ].join(" ")}
        style={
          mobile
            ? {
                border: `1.75px dashed rgba(0,0,0,0.2)`,
                minHeight: "202px",
              }
            : undefined
        }
      >
        <UploadCloud
          className={`${mobile ? "w-9 h-9" : "w-8 h-8"} ${
            isDragging ? "text-[#E8460E]" : "text-[#AAAAAA]"
          }`}
          strokeWidth={1.5}
        />
        <div className="text-center flex flex-col gap-1">
          <p
            className={`font-medium text-[#1A1A1A] ${mobile ? "text-[14px]" : "text-sm"}`}
          >
            {value ? value.name : "Choose a file or drag & drop it here"}
          </p>
          {!value && (
            <p className={`text-[#AAAAAA] ${mobile ? "text-[12px]" : "text-xs"}`}>
              JPEG, PNG, upto 10MB
            </p>
          )}
        </div>
        {!value && (
          <button
            type="button"
            className={[
              "rounded-lg border border-[#D9D9D9] bg-white font-medium text-[#1A1A1A] hover:bg-[#F4F6FA] transition-colors",
              mobile ? "px-5 py-2 text-[13px]" : "px-4 py-1.5 text-xs",
            ].join(" ")}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(inputId)?.click();
            }}
          >
            Browse Files
          </button>
        )}
        <input
          id={inputId}
          type="file"
          accept=".jpeg,.jpg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Caption below upload zone */}
      <p
        className={[
          "text-center",
          mobile
            ? "font-medium text-[16px] text-center"
            : "text-xs text-[#AAAAAA]",
        ].join(" ")}
        style={
          mobile
            ? { color: "rgba(48,48,48,0.6)", letterSpacing: "-0.04em" }
            : undefined
        }
      >
        Upload images of your preferred document/image
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
