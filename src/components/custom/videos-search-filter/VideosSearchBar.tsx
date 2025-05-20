/**
 * VideosSearchBar Component
 * 
 * A search input component specifically designed for the videos search functionality.
 * Features:
 * - Fixed width design
 * - Search icon integration
 * - Clear text button
 * - Placeholder text for user guidance
 * - Accessible input with proper labeling
 */

"use client"

import React from "react";
import { Search, X } from "lucide-react";

export interface VideosSearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

export default function VideosSearchBar({ searchText, onSearchChange }: VideosSearchBarProps) {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="flex items-center gap-2 h-10 border-2 border-red-500 rounded-md px-3">
      <Search className="w-5 h-5 text-red-500" />
      <input
        type="text"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Find Expert Videos..."
        className="w-full outline-none text-sm"
      />
      {searchText && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          style={{ minWidth: '16px' }}
        >
          <X className="w-2.5 h-2.5 cursor-pointer" />
        </button>
      )}
    </div>
  );
} 