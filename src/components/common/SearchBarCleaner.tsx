"use client"

import React from "react";
import { X } from "lucide-react";

interface SearchBarCleanerProps {
  onClear: () => void;
}

export default function SearchBarCleaner({ onClear }: SearchBarCleanerProps) {
  return (
    <button
      onClick={onClear}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
      style={{ minWidth: '16px' }}
    >
      <X className="w-2.5 h-2.5 cursor-pointer" />
    </button>
  );
} 