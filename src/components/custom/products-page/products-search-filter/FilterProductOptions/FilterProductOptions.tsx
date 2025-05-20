/**
 * FilterProductOptions Component
 * 
 * A component that provides a set of filter dropdowns for filtering products by:
 * - Brand
 * - Type
 * - Thickness
 * - Color
 * 
 * This component manages the state for all filter dropdowns and handles:
 * - Dropdown open/close states
 * - Selected values for each filter
 * - Click outside and escape key handling
 * 
 * Component Hierarchy:
 * - ProductsSearchFilter (Parent)
 *   - FilterProductOptions (This component)
 *     - FilterDropdown (Child, used for each filter type)
 * 
 * State Management:
 * - Uses individual state for each filter type
 * - Manages a single openDropdown state to ensure only one dropdown is open at a time
 * - Handles click outside and escape key events for better UX
 */

"use client"

import React, { useState, useEffect, useRef } from "react";
import FilterDropdown from "./FilterDropdown";
import { brands, types, thicknesses, colorOptions } from "./filters-data";
import { useFilters } from "@/context/filter-context";

export default function FilterProductOptions() {
  // Get filter state and setter from context
  const { filters, setFilters } = useFilters();
  
  // State for managing which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Ref for handling click outside events
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside and escape key events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full md:w-auto max-w-full overflow-x-hidden" ref={dropdownRef}>
      {/* Brand Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Brand"
          selectedValue={filters.brand}
          isOpen={openDropdown === "brand"}
          onToggle={() => setOpenDropdown(openDropdown === "brand" ? null : "brand")}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, brand: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, brand: "" }));
            setOpenDropdown(null);
          }}
          options={brands}
        />
      </div>

      {/* Type Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Type"
          selectedValue={filters.type}
          isOpen={openDropdown === "type"}
          onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, type: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, type: "" }));
            setOpenDropdown(null);
          }}
          options={types}
        />
      </div>

      {/* Thickness Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Thickness"
          selectedValue={filters.thickness}
          isOpen={openDropdown === "thickness"}
          onToggle={() => setOpenDropdown(openDropdown === "thickness" ? null : "thickness")}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, thickness: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, thickness: "" }));
            setOpenDropdown(null);
          }}
          options={thicknesses}
        />
      </div>

      {/* Color Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Color"
          selectedValue={filters.color}
          isOpen={openDropdown === "color"}
          onToggle={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, color: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, color: "" }));
            setOpenDropdown(null);
          }}
          options={colorOptions}
        />
      </div>
    </div>
  );
} 