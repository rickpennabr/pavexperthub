/**
 * BlogSearchBar Component
 * 
 * A search input component with a search icon and placeholder text
 * for finding blog posts.
 */

"use client"

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { colors } from "@/app/config/colors";

interface BlogSearchBarProps {
  onFocus?: () => void;
}

export default function BlogSearchBar({ onFocus }: BlogSearchBarProps) {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className="flex-1 flex items-center gap-2 h-10 border-2 border-red-500 rounded-md px-3">
      <Search className="w-5 h-5 text-red-500" />
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={onFocus}
        placeholder="Find Expert Blog Posts..."
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