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
import ProductsSearchBar from "./ProductsSearchBar";
import FilterProductOptions from "./FilterProductOptions/FilterProductOptions";
import GridOptions from "./GridOptions";
import { Plus, Minus } from "lucide-react";

export default function ProductsSearchFilter() {
  const [isExpanded, setIsExpanded] = useState(false);
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
        <div className="hidden md:flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Mobile Layout */}
      <div className={`md:hidden flex flex-col gap-2 p-2 bg-white border-b border-black ${isExpanded ? 'pb-2' : 'pb-0'}`}>
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex items-center justify-between h-8">
            <h2 className="text-sm md:text-base font-bold text-gray-900 leading-none m-0 p-0 flex items-center h-full">
              Search and Filter Options:
            </h2>
            <button
              type="button"
              className="text-red-500 hover:text-red-600 transition-colors flex items-center justify-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minus className="h-5 w-5" strokeWidth={3} />
              ) : (
                <Plus className="h-5 w-5" strokeWidth={3} />
              )}
            </button>
          </div>
          <div className={`flex flex-col gap-2 transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-hidden">
              <FilterProductOptions />
            </div>
            <div className="flex items-center gap-2">
              <div 
                ref={searchContainerRef}
                className="flex-1"
              >
                <ProductsSearchBar onFocus={() => setIsSearchExpanded(true)} />
              </div>
              <div className={`transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'hidden' : 'flex items-center'
              }`}>
                <GridOptions />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
        <div 
          ref={searchContainerRef}
          className={`transition-all duration-300 ease-in-out ${
            isSearchExpanded ? 'flex-1' : 'flex-1'
          }`}
        >
          <ProductsSearchBar onFocus={() => setIsSearchExpanded(true)} />
        </div>
        <div className={`transition-all duration-300 ease-in-out ${
          isSearchExpanded ? 'hidden' : 'flex items-center gap-2'
        }`}>
          <FilterProductOptions />
          <GridOptions />
        </div>
      </div>
    </section>
  );
} 