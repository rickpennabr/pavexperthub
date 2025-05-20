"use client"

import React, { useState, useEffect, useRef } from "react";
import ProductsSearchBar from "./ProductsSearchBar";
import FilterProductOptions from "./FilterProductOptions/FilterProductOptions";
import GridOptions from "./GridOptions";
import { Plus, Minus } from "lucide-react";

export default function ProductsSearchFilter() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
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
      <div className="md:hidden flex flex-col gap-2 p-2 bg-white border-b border-black">
        <div className={`flex flex-col ${isExpanded ? 'gap-2' : 'gap-0'}`}>
          <div className="flex items-center justify-between h-8 relative">
            <h2 className="text-sm font-bold text-gray-900 leading-none m-0 p-0 flex items-center h-full">
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
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></div>
          </div>
          <div className={`flex flex-col gap-2 transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-hidden">
              <FilterProductOptions />
            </div>
            <div className="flex items-center gap-2">
              <div 
                ref={searchContainerRef}
                className="flex-1 h-10"
              >
                <ProductsSearchBar />
              </div>
              <div className="flex items-center">
                <GridOptions />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-[60px] p-1 items-center gap-4 bg-white border-b border-black">
        <div className="flex-1">
          <ProductsSearchBar />
        </div>
        <div className="flex items-center gap-4">
          <FilterProductOptions />
          <GridOptions />
        </div>
      </div>
    </section>
  );
} 