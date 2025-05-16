'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type FilterType = {
  brand: string;
  type: string;
  thickness: string;
  color: string;
  location: string;
  price: string;
};

// Define the context type
type FilterContextType = {
  searchText: string;
  setSearchText: (text: string) => void;
  filters: FilterType;
  setFilters: (filters: FilterType | ((prev: FilterType) => FilterType)) => void;
  resetFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
};

// Create the context with default values
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Create the provider component
export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterType>({
    brand: '',
    type: '',
    thickness: '',
    color: '',
    location: '',
    price: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Set initial view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Use list view for mobile (screen width < 640px) and grid view for larger screens
      if (window.innerWidth < 640) {
        setViewMode('list');
      } else {
        setViewMode('grid');
      }
    };

    // Set initial view mode
    handleResize();

    // Update view mode when window is resized
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initialize filters
  useEffect(() => {
    setIsLoading(true);
    try {
      // Load any saved filters from localStorage if needed
      const savedFilters = localStorage.getItem('filters');
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setSearchText('');
    setFilters({
      brand: '',
      type: '',
      thickness: '',
      color: '',
      location: '',
      price: '',
    });
    setCurrentPage(1);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        searchText,
        setSearchText,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        resetFilters,
        viewMode,
        setViewMode,
        isLoading,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Create a custom hook to use the filter context
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 