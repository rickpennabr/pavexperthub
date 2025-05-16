/**
 * GridOptions Component
 * 
 * View options for switching between list and grid layouts
 * with toggle buttons. Grid view is active by default on PC,
 * list view is active by default on mobile.
 */

"use client"

import React, { useState, useEffect } from "react";
import { List, Grid } from "lucide-react";


export default function GridOptions() {
  const [isGrid, setIsGrid] = useState(true);

  // Set initial view based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsGrid(window.innerWidth >= 640); // 640px is the sm breakpoint
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setIsGrid(false)}
        className={`h-10 w-10 flex items-center justify-center border-2 border-black rounded-md transition-colors cursor-pointer
          ${!isGrid ? 'bg-black' : 'hover:bg-gray-100'}`}
      >
        <List className={`w-5 h-5 ${!isGrid ? 'text-white' : 'text-black'}`} />
      </button>
      <button 
        onClick={() => setIsGrid(true)}
        className={`h-10 w-10 flex items-center justify-center border-2 border-black rounded-md transition-colors cursor-pointer
          ${isGrid ? 'bg-black' : 'hover:bg-gray-100'}`}
      >
        <Grid className={`w-5 h-5 ${isGrid ? 'text-white' : 'text-black'}`} />
      </button>
    </div>
  );
} 