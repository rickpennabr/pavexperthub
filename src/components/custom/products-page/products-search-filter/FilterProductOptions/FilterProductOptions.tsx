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
 * - Writes brand, type, thickness, and color into the shared filter context
 * - Manages a single openDropdown state to ensure only one dropdown is open at a time
 * - Handles click outside and escape key events for better UX
 */

"use client"

import React, { useEffect, useState, useRef } from 'react';
import { getBrands, getProductTypes, getThicknesses, getColors } from '@/services/productService';
import { useFilters } from '@/context/filter-context';
import { thicknessLabel } from '@/lib/product-filters';
import FilterDropdown from './FilterDropdown';

export default function FilterProductOptions() {
  const { filters, setFilters } = useFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [thicknesses, setThicknesses] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        const [brandsResponse, typesResponse, thicknessesResponse, colorsResponse] = await Promise.all([
          getBrands(),
          getProductTypes(),
          getThicknesses(),
          getColors()
        ]);

        if (brandsResponse.data) {
          setBrands(brandsResponse.data.map(brand => brand.brand_name));
        }
        if (typesResponse.data) {
          setTypes(typesResponse.data);
        }
        if (thicknessesResponse.data) {
          setThicknesses(thicknessesResponse.data.map((item) => thicknessLabel(item)));
        }
        if (colorsResponse.data) {
          setColors(colorsResponse.data.map(color => color.color_name));
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle click outside and escape key events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
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
          onOpen={() => setOpenDropdown("brand")}
          onClose={() => setOpenDropdown((current) => (current === "brand" ? null : current))}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, brand: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, brand: "" }));
            setOpenDropdown(null);
          }}
          options={brands}
          isLoading={isLoading}
        />
      </div>

      {/* Type Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Type"
          selectedValue={filters.type}
          isOpen={openDropdown === "type"}
          onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
          onOpen={() => setOpenDropdown("type")}
          onClose={() => setOpenDropdown((current) => (current === "type" ? null : current))}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, type: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, type: "" }));
            setOpenDropdown(null);
          }}
          options={types}
          isLoading={isLoading}
        />
      </div>

      {/* Thickness Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Thickness"
          selectedValue={filters.thickness}
          isOpen={openDropdown === "thickness"}
          onToggle={() => setOpenDropdown(openDropdown === "thickness" ? null : "thickness")}
          onOpen={() => setOpenDropdown("thickness")}
          onClose={() => setOpenDropdown((current) => (current === "thickness" ? null : current))}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, thickness: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, thickness: "" }));
            setOpenDropdown(null);
          }}
          options={thicknesses}
          isLoading={isLoading}
        />
      </div>

      {/* Color Filter Dropdown */}
      <div className="flex-1 md:flex-none min-w-0">
        <FilterDropdown
          label="Pick a Color"
          selectedValue={filters.color}
          isOpen={openDropdown === "color"}
          onToggle={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
          onOpen={() => setOpenDropdown("color")}
          onClose={() => setOpenDropdown((current) => (current === "color" ? null : current))}
          onSelect={(value) => {
            setFilters(prev => ({ ...prev, color: value }));
            setOpenDropdown(null);
          }}
          onClear={() => {
            setFilters(prev => ({ ...prev, color: "" }));
            setOpenDropdown(null);
          }}
          options={colors}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 