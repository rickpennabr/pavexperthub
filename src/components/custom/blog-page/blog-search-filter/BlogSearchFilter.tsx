/**
 * BlogSearchFilter Component
 * 
 * A container component that assembles the main search and filter interface for the blog page.
 * This component manages the layout and interaction between:
 * - BlogSearchBar: For text-based blog search
 * - BlogOptions: For filtering blog posts by category
 * 
 * Features:
 * - Consistent layout without expansion
 * - Click outside and escape key handling
 * - Smooth transitions between states
 * - Mobile-optimized layout
 * 
 * Component Hierarchy:
 * - BlogSearchFilter (This component)
 *   - BlogSearchBar (Child)
 *   - BlogOptions (Child)
 */

"use client"

import React, { useState, useEffect } from "react";
import BlogSearchBar from "./BlogSearchBar";
import BlogOptions from "./BlogOptions/BlogOptions";

export default function BlogSearchFilter() {
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
    <section className="w-full bg-white border-b border-black rounded-lg">
      {/* Mobile Layout */}
      <div className="sm:hidden flex items-center gap-2 p-2">
        <div className="flex-1">
          <BlogSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[120px]">
          <BlogOptions
            onSelect={handleCategorySelect}
            selectedValue={selectedCategory}
            onClear={handleCategoryClear}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[60px] p-1 items-center gap-4">
        <div className="flex-1">
          <BlogSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[200px]">
          <BlogOptions
            onSelect={handleCategorySelect}
            selectedValue={selectedCategory}
            onClear={handleCategoryClear}
          />
        </div>
      </div>
    </section>
  );
} 