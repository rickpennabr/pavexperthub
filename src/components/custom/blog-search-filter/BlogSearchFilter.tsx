/**
 * BlogSearchFilter Component
 * 
 * A container component that assembles the main search and filter interface for the blog page.
 * This component manages the layout and interaction between:
 * - BlogSearchBar: For text-based blog search
 * 
 * Features:
 * - Responsive layout that adapts to search bar focus
 * - Click outside and escape key handling for search expansion
 * - Smooth transitions between states
 * - Mobile-optimized layout with two rows and label
 * 
 * Component Hierarchy:
 * - BlogSearchFilter (This component)
 *   - BlogSearchBar (Child)
 */

"use client"

import React, { useState, useEffect, useRef } from "react";
import BlogSearchBar from "./BlogSearchBar";

export default function BlogSearchFilter() {
  const [isClient, setIsClient] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <section className="w-full">
      {/* Mobile Layout */}
      <div className="md:hidden flex p-2 bg-white border-b border-black">
        <div 
          ref={searchContainerRef}
          className="flex-1"
        >
          <BlogSearchBar />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
        <div 
          ref={searchContainerRef}
          className="flex-1"
        >
          <BlogSearchBar />
        </div>
      </div>
    </section>
  );
} 