/**
 * VideosSearchFilter Component
 * 
 * A container component that assembles the main search and filter interface for the videos page.
 * This component manages the layout and interaction between:
 * - VideosSearchBar: For text-based video search
 * - VideosOptions: For filtering videos by category
 * 
 * Features:
 * - Fixed layout without expansion
 * - Click outside and escape key handling
 * - Mobile-optimized layout
 * 
 * Component Hierarchy:
 * - VideosSearchFilter (This component)
 *   - VideosSearchBar (Child)
 *   - VideosOptions (Child)
 */

"use client"

import React, { useState, useEffect } from "react";
import VideosSearchBar from "./VideosSearchBar";
import VideosOptions from "./VideosOptions/VideosOptions";

export default function VideosSearchFilter() {
  const [isClient, setIsClient] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCategoryClear = () => {
    setSelectedCategory("");
  };

  if (!isClient) {
    return (
      <section className="w-full">
        <div className="flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white border-b border-black">
      {/* Mobile Layout */}
      <div className="sm:hidden flex items-center gap-2 p-2">
        <div className="flex-1">
          <VideosSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[120px]">
          <VideosOptions
            onSelect={handleCategorySelect}
            selectedValue={selectedCategory}
            onClear={handleCategoryClear}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[60px] p-1 items-center gap-4">
        <div className="flex-1">
          <VideosSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[200px]">
          <VideosOptions
            onSelect={handleCategorySelect}
            selectedValue={selectedCategory}
            onClear={handleCategoryClear}
          />
        </div>
      </div>
    </section>
  );
} 