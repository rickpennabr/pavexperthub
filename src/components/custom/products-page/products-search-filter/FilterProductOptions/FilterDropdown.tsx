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
 * @param isLoading - Indicates whether the dropdown is in a loading state
 */
interface FilterDropdownProps {
  label: string;
  selectedValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClear: () => void;
  options: string[];
  isLoading?: boolean;
}

export default function FilterDropdown({
  label,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
  onClear,
  options,
  isLoading = false
}: FilterDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get short label for mobile
  const shortLabel = label.replace("Pick a ", "");

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Update dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownElement = dropdownRef.current;
      if (dropdownElement) {
        dropdownElement.style.setProperty('--dropdown-left', `${buttonRect.left}px`);
        dropdownElement.style.setProperty('--dropdown-top', `${buttonRect.bottom + 1}px`);
        dropdownElement.style.setProperty('--dropdown-width', `${buttonRect.width}px`);
      }
    }
  }, [isOpen]);

  const handleOptionClick = (option: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(option);
  };

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
            <ChevronDown className={`ml-1 md:ml-2 h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${selectedValue ? 'text-white' : 'text-gray-500'}`} />
          </>
        )}
      </button>
      {selectedValue && <FilterClearButton onClick={onClear} />}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed left-[var(--dropdown-left)] top-[var(--dropdown-top)] z-[9999]"
          style={{ width: 'var(--dropdown-width)' }}
        >
          <div className="origin-top-right w-full rounded-md shadow-lg bg-white border-2 border-red-500">
            <div 
              className={`py-1 ${options.length > 10 ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`} 
              role="menu" 
              aria-orientation="vertical"
            >
              {isLoading ? (
                <div className="p-2 text-center text-gray-500">Loading...</div>
              ) : (
                <>
                  {options.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[11px] sm:text-xs md:text-sm text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all ${
                            option.length > 10 ? "text-[10px] sm:text-[10px] md:text-[11px]" : ""
                          } cursor-pointer touch-manipulation ${selectedValue === option ? "!bg-black !text-white font-bold" : ""}`}
                          role="menuitem"
                          onClick={(e) => handleOptionClick(option, e)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-center text-gray-500">No options available</div>
                  )}
                  {selectedValue && (
                    <button
                      onClick={onClear}
                      className="w-full px-3 py-2 text-sm text-red-600 border-t border-gray-200 hover:bg-red-50"
                    >
                      Clear selection
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 