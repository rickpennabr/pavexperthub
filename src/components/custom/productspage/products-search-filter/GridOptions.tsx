/**
 * GridOptions Component
 * 
 * View options for switching between list and grid layouts
 * with toggle buttons. Grid view is active by default on PC,
 * list view is active by default on mobile.
 */

"use client"

import React, { useEffect } from "react";
import { List, Grid } from "lucide-react";
import { useFilters } from "@/context/filter-context";

export default function GridOptions() {
  const { viewMode, setViewMode } = useFilters();

  // Set initial view based on screen size
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth >= 640 ? 'grid' : 'list'); // 640px is the sm breakpoint
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setViewMode]);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setViewMode('list')}
        className={`h-10 w-10 flex items-center justify-center border-2 border-black rounded-md transition-colors cursor-pointer
          ${viewMode === 'list' ? 'bg-black' : 'hover:bg-gray-100'}`}
      >
        <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-white' : 'text-black'}`} />
      </button>
      <button 
        onClick={() => setViewMode('grid')}
        className={`h-10 w-10 flex items-center justify-center border-2 border-black rounded-md transition-colors cursor-pointer
          ${viewMode === 'grid' ? 'bg-black' : 'hover:bg-gray-100'}`}
      >
        <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-white' : 'text-black'}`} />
      </button>
    </div>
  );
} 