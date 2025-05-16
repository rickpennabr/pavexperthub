/**
 * ProductsSearchBar Component
 * 
 * A search input component with a search icon and placeholder text
 * for finding hardscape materials.
 */

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
          placeholder="Find Services..."
          className="block w-full pl-10 pr-10 h-10 border-2 border-red-500 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-red-300 focus:border-red-500 text-base transition-all duration-300"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={onFocus}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        {searchText && <SearchBarCleaner onClear={handleClear} />}
      </div>
    </div>
  );
} 