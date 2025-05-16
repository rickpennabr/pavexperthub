/**
 * VideosSearchFilter Component
 * 
 * A container component that assembles the main search and filter interface for the videos page.
 * This component manages the layout and interaction between:
 * - VideosSearchBar: For text-based video search
 * - VideoOptions: For filtering videos by category
 * 
 * Features:
 * - Responsive layout that adapts to search bar focus
 * - Click outside and escape key handling for search expansion
 * - Smooth transitions between states
 * - Mobile-optimized layout with two rows and label
 * 
 * Component Hierarchy:
 * - VideosSearchFilter (This component)
 *   - VideosSearchBar (Child)
 *   - VideoOptions (Child)
 */

"use client"

import React, { useState } from "react";
import VideosSearchBar from "./VideosSearchBar";
import VideoOptions from "./VideoOptions/VideoOptions";

interface VideosSearchFilterProps {
  children?: React.ReactNode;
}

export default function VideosSearchFilter({ children }: VideosSearchFilterProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCategoryClear = () => {
    setSelectedCategory("");
  };

  const handleSearchFocus = (focused: boolean) => {
    setIsSearchFocused(focused);
  };

  return (
    <section className="w-full bg-white border-b border-black">
      {/* Mobile Layout */}
      <div className="sm:hidden flex items-center gap-2 p-2">
        <div className={`flex-1 transition-all duration-300 ${isSearchFocused ? 'w-full' : 'w-auto'}`}>
          <VideosSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onFocusChange={handleSearchFocus}
          />
        </div>
        {!isSearchFocused && (
          <div className="w-[120px]">
            <VideoOptions
              onSelect={handleCategorySelect}
              selectedValue={selectedCategory}
              onClear={handleCategoryClear}
            />
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[60px] p-1 items-center gap-4">
        <div className={`flex-1 transition-all duration-300 ${isSearchFocused ? 'w-full' : 'w-auto'}`}>
          <VideosSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onFocusChange={handleSearchFocus}
          />
        </div>
        {!isSearchFocused && (
          <div className="w-[200px]">
            <VideoOptions
              onSelect={handleCategorySelect}
              selectedValue={selectedCategory}
              onClear={handleCategoryClear}
            />
          </div>
        )}
      </div>
    </section>
  );
} 