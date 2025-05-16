/**
 * VideosSearchBar Component
 * 
 * A search input component with a search icon and placeholder text
 * for finding video content.
 */

"use client"

import React from "react";
import { Search, X } from "lucide-react";

interface VideosSearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onFocusChange: (focused: boolean) => void;
}

export default function VideosSearchBar({ searchText, onSearchChange, onFocusChange }: VideosSearchBarProps) {
  const handleClear = () => {
    if (searchText) {
      onSearchChange("");
    } else {
      onFocusChange(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          placeholder="Find Expert Video Content..."
          className="w-full h-10 pl-10 pr-10 text-[11px] sm:text-xs md:text-sm border-2 border-red-500 rounded-md focus:outline-none focus:border-red-600 text-base"
          style={{ height: '40px', maxHeight: '40px', minHeight: '40px' }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        {searchText && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            style={{ minWidth: '16px' }}
          >
            <X className="w-2.5 h-2.5 cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
} 