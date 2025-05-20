/**
 * VideosOptions Component
 * 
 * A dropdown component for selecting video categories with a consistent design
 * that matches the product filters. Features include:
 * - Dropdown toggle with chevron animation
 * - Option selection with visual feedback
 * - Clear selection button
 * - Responsive text sizing
 * - Click outside handling
 * - Mobile and desktop layouts
 */

"use client"

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import FilterClearButton from "./FilterClearButton";

interface VideosOptionsProps {
  onSelect: (value: string) => void;
  selectedValue: string;
  onClear: () => void;
}

export default function VideosOptions({ onSelect, selectedValue, onClear }: VideosOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    "Installation Guides",
    "Product Reviews",
    "Maintenance Tips",
    "Project Showcases",
    "Expert Tips",
    "Industry News",
    "How-To Videos"
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownElement = dropdownRef.current;
      if (dropdownElement) {
        dropdownElement.style.setProperty('--dropdown-left', `${buttonRect.left}px`);
        dropdownElement.style.setProperty('--dropdown-top', `${buttonRect.bottom + 4}px`);
        dropdownElement.style.setProperty('--dropdown-width', `${buttonRect.width}px`);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center w-full">
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-center h-10 px-2 sm:px-3 border-2 rounded-md text-[11px] sm:text-xs md:text-sm cursor-pointer transition-all duration-300 min-w-[60px] sm:min-w-[80px] md:min-w-0 w-full touch-manipulation
        ${selectedValue ? 'bg-black text-white font-bold border-black' : 'border-red-500 hover:border-red-600'}`}
        onClick={handleToggle}
      >
        {selectedValue ? (
          <span className={`font-bold ${selectedValue.length > 10 ? "text-[10px] sm:text-[10px] md:text-[11px]" : "text-[11px] sm:text-xs md:text-sm"}`}>
            {selectedValue}
          </span>
        ) : (
          <>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold">
              Select Category
            </span>
            <ChevronDown className={`ml-1 md:ml-2 h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${selectedValue ? 'text-white' : 'text-gray-500'}`} />
          </>
        )}
      </button>
      {selectedValue && <FilterClearButton onClick={onClear} />}
      
      {isOpen && (
        <>
          {/* Mobile Dropdown */}
          <div 
            ref={dropdownRef}
            className="fixed sm:hidden left-[var(--dropdown-left)] top-[var(--dropdown-top)] z-[9999]"
            style={{ width: 'var(--dropdown-width)' }}
          >
            <div className="origin-top-right w-full rounded-md shadow-lg bg-white border-2 border-red-500">
              <div 
                className="py-1" 
                role="menu" 
                aria-orientation="vertical"
              >
                {options.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[11px] sm:text-xs md:text-sm text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all ${
                      option.length > 10 ? "text-[10px] sm:text-[10px] md:text-[11px]" : ""
                    } cursor-pointer touch-manipulation ${selectedValue === option ? "!bg-black !text-white font-bold" : ""}`}
                    role="menuitem"
                    onClick={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Dropdown */}
          <div 
            ref={dropdownRef}
            className="hidden sm:block fixed left-[var(--dropdown-left)] top-[var(--dropdown-top)] z-[9999]"
            style={{ width: 'var(--dropdown-width)' }}
          >
            <div className="origin-top-right w-full rounded-md shadow-lg bg-white border-2 border-red-500">
              <div 
                className="py-1" 
                role="menu" 
                aria-orientation="vertical"
              >
                {options.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[11px] sm:text-xs md:text-sm text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all ${
                      option.length > 10 ? "text-[10px] sm:text-[10px] md:text-[11px]" : ""
                    } cursor-pointer touch-manipulation ${selectedValue === option ? "!bg-black !text-white font-bold" : ""}`}
                    role="menuitem"
                    onClick={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 