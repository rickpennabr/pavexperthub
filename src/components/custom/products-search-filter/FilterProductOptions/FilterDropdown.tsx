/**
 * FilterDropdown Component
 * 
 * A reusable dropdown component used by FilterProductOptions to create consistent filter dropdowns.
 * This component handles the UI and interaction logic for individual filter dropdowns, including:
 * - Dropdown toggle
 * - Option selection
 * - Clear selection
 * - Responsive text sizing
 * 
 * Used by: FilterProductOptions
 */

import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import FilterClearButton from "./FilterClearButton";
import "./styles.css";

/**
 * Props for the FilterDropdown component
 * @param label - The text shown when no option is selected
 * @param selectedValue - Currently selected option value
 * @param isOpen - Controls the dropdown's open/closed state
 * @param onToggle - Callback for toggling the dropdown
 * @param onSelect - Callback when an option is selected
 * @param onClear - Callback for clearing the selection
 * @param options - Array of available options to display
 */
interface FilterDropdownProps {
  label: string;
  selectedValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClear: () => void;
  options: string[];
}

export default function FilterDropdown({
  label,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
  onClear,
  options,
}: FilterDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the short label (without "Pick a") for mobile
  const shortLabel = label.replace("Pick a ", "");

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const top = buttonRect.bottom + window.scrollY + 1; // Add 1px gap
      const left = buttonRect.left + window.scrollX;
      const width = buttonRect.width;
      document.documentElement.style.setProperty('--dropdown-top', `${top}px`);
      document.documentElement.style.setProperty('--dropdown-left', `${left}px`);
      document.documentElement.style.setProperty('--dropdown-width', `${width}px`);
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center w-full">
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-center h-10 px-2 sm:px-3 border-2 rounded-md text-[11px] sm:text-xs md:text-sm cursor-pointer transition-all duration-300 min-w-[60px] sm:min-w-[80px] md:min-w-0 w-full touch-manipulation
        ${selectedValue ? 'bg-black text-white font-bold border-black' : 'border-red-500 hover:border-red-600'}`}
        onClick={onToggle}
      >
        {selectedValue ? (
          <span className={`font-bold ${selectedValue.length > 10 ? "text-[10px] sm:text-[10px] md:text-[11px]" : "text-[11px] sm:text-xs md:text-sm"}`}>
            {selectedValue}
          </span>
        ) : (
          <>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold">
              <span className="md:hidden">{shortLabel}</span>
              <span className="hidden md:inline">{label}</span>
            </span>
            <ChevronDown className="ml-1 md:ml-2 h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
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
                className={`py-1 ${options.length > 10 ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`} 
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
                    onClick={() => onSelect(option)}
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
                className={`py-1 ${options.length > 10 ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`} 
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
                    onClick={() => onSelect(option)}
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