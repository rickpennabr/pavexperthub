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

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const VIDEO_CATEGORIES = [
  "Installation Guides",
  "Product Reviews",
  "Maintenance Tips",
  "Project Showcases",
  "Expert Tips",
  "Industry News",
  "How-To Videos"
];

export default function VideosSearchFilter() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };
  }, [isDropdownOpen]);

  // Update dropdown position
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownElement = dropdownRef.current;
      if (dropdownElement) {
        dropdownElement.style.setProperty('--dropdown-left', `${buttonRect.left}px`);
        dropdownElement.style.setProperty('--dropdown-top', `${buttonRect.bottom + 4}px`);
        dropdownElement.style.setProperty('--dropdown-width', `${buttonRect.width}px`);
  }
    }
  }, [isDropdownOpen]);

  return (
    <section className="w-full bg-white border-b border-black rounded-lg mb-4">
      {/* Mobile Layout */}
      <div className="sm:hidden flex items-center gap-2 p-2">
        <div className="flex-1">
          <div className="flex-1 flex items-center gap-2 h-10 border-2 border-red-500 rounded-lg px-3">
            <Search className="w-5 h-5 text-red-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Find Expert Videos..."
              className="w-full outline-none text-base"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                style={{ minWidth: '16px' }}
              >
                <X className="w-2.5 h-2.5 cursor-pointer" />
              </button>
            )}
          </div>
        </div>
        <div className="w-[120px]">
          <div className="relative flex items-center w-full">
            <button
              ref={buttonRef}
              type="button"
              className={`flex items-center justify-center h-10 px-2 border-2 rounded-md text-[11px] cursor-pointer transition-all duration-300 min-w-[60px] w-full
              ${selectedCategory ? 'bg-black text-white font-bold border-black' : 'border-red-500 hover:border-red-600'}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCategory ? (
                <span className="font-bold text-[10px]">
                  {selectedCategory}
                </span>
              ) : (
                <>
                  <span className="text-[11px] font-bold">
                    Category
                  </span>
                  <ChevronDown className={`ml-1 h-3 w-3 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${selectedCategory ? 'text-white' : 'text-gray-500'}`} />
                </>
              )}
            </button>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="absolute -right-2 -top-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[60px] p-1 items-center gap-4">
        <div className="flex-1">
          <div className="flex-1 flex items-center gap-2 h-10 border-2 border-red-500 rounded-lg px-3">
            <Search className="w-5 h-5 text-red-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Find Expert Videos..."
              className="w-full outline-none text-base"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                style={{ minWidth: '16px' }}
              >
                <X className="w-2.5 h-2.5 cursor-pointer" />
              </button>
            )}
          </div>
        </div>
        <div className="w-[200px]">
          <div className="relative flex items-center w-full">
            <button
              ref={buttonRef}
              type="button"
              className={`flex items-center justify-center h-10 px-3 border-2 rounded-md text-sm cursor-pointer transition-all duration-300 w-full
              ${selectedCategory ? 'bg-black text-white font-bold border-black' : 'border-red-500 hover:border-red-600'}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCategory ? (
                <span className="font-bold text-sm">
                  {selectedCategory}
                </span>
              ) : (
                <>
                  <span className="text-sm font-bold">
                    Select Category
                  </span>
                  <ChevronDown className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${selectedCategory ? 'text-white' : 'text-gray-500'}`} />
                </>
              )}
            </button>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="absolute -right-2 -top-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="fixed left-[var(--dropdown-left)] top-[var(--dropdown-top)] z-[9999]"
          style={{ width: 'var(--dropdown-width)' }}
        >
          <div className="origin-top-right w-full rounded-md shadow-lg bg-white border-2 border-red-500">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {VIDEO_CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all cursor-pointer ${
                    selectedCategory === category ? "!bg-black !text-white font-bold" : ""
                  }`}
                  role="menuitem"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 