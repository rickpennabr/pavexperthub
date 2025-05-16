/**
 * ProductsSearchFilter Component
 * 
 * A container component that assembles the main search and filter interface for the products page.
 * This component manages the layout and interaction between:
 * - ProductsSearchBar: For text-based product search
 * - FilterProductOptions: For filtering products by various attributes
 * - GridOptions: For controlling the product grid view
 * 
 * Features:
 * - Responsive layout that adapts to search bar focus
 * - Click outside and escape key handling for search expansion
 * - Smooth transitions between states
 * - Mobile-optimized layout with two rows and label
 * 
 * Component Hierarchy:
 * - ProductsSearchFilter (This component)
 *   - ProductsSearchBar (Child)
 *   - FilterProductOptions (Child)
 *     - FilterDropdown (Grandchild)
 *   - GridOptions (Child)
 */

"use client"

import React, { useState, useEffect, useRef } from "react";
import ServicesSearchBar from "./ServicesSearchBar";

export default function ServicesSearchFilter() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside and escape key events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
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
          <ServicesSearchBar onFocus={() => setIsSearchExpanded(true)} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
        <div 
          ref={searchContainerRef}
          className="flex-1"
        >
          <ServicesSearchBar onFocus={() => setIsSearchExpanded(true)} />
        </div>
      </div>
    </section>
  );
} 