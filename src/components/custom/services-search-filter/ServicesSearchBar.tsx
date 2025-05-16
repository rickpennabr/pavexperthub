"use client"

import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import SearchBarCleaner from "@/components/common/SearchBarCleaner";

interface ServicesSearchBarProps {
  onFocus?: () => void;
}

export default function ServicesSearchBar({ onFocus }: ServicesSearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (searchText) {
      setSearchText("");
      // Keep focus on input after clearing
      inputRef.current?.focus();
    } else {
      onFocus?.();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => onFocus?.()}
          placeholder="Search Services..."
          className="w-full h-10 pl-10 pr-10 text-[11px] sm:text-xs md:text-sm border-2 border-red-500 rounded-md focus:outline-none focus:border-red-600"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        {searchText && <SearchBarCleaner onClear={handleClear} />}
      </div>
    </div>
  );
} 