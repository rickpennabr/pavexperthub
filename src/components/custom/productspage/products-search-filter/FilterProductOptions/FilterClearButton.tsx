import React from "react";
import { X } from "lucide-react";

interface FilterClearButtonProps {
  onClick: () => void;
}

export default function FilterClearButton({ onClick }: FilterClearButtonProps) {
  return (
    <button
      onClick={onClick}
      className="ml-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
      style={{ minWidth: '16px' }}
    >
      <X className="w-2.5 h-2.5 cursor-pointer" />
    </button>
  );
} 