import React from "react";
import { X } from "lucide-react";

interface FilterClearButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FilterClearButton({ onClick, className = "" }: FilterClearButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ml-2 flex items-center justify-center w-5 h-5 min-w-[20px] rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors ${className}`}
      aria-label="Clear filter"
    >
      <X className="w-3 h-3" />
    </button>
  );
} 