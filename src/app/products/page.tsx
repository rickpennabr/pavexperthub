'use client';

import React, { Suspense, useMemo } from "react";
import { products } from '@/data/products';
import ProductGridItem from '@/components/layout/ProductGridItem';
import { useFilters } from '@/context/filter-context';
import { FilterProvider } from '@/context/filter-context';

function LoadingProducts() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );
}

function ProductsGrid() {
  const { viewMode, searchText, filters, currentPage, itemsPerPage } = useFilters();

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search text filter
      if (searchText && !product.product_name.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Type filter
      if (filters.type && product.product_type !== filters.type) {
        return false;
      }

      // Thickness filter
      if (filters.thickness && product.thickness !== filters.thickness) {
        return false;
      }

      // Color filter
      if (filters.color && product.color !== filters.color) {
        return false;
      }

      return true;
    });
  }, [searchText, filters]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, itemsPerPage]);

  if (!products || products.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-2.5 md:gap-y-2.5 gap-y-3 gap-x-2 md:px-2.5 px-2 pb-2.5' 
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-2 md:gap-y-3 gap-y-2 gap-x-1 md:px-1 px-1 md:pb-4 pb-5'
    }`}>
      {paginatedProducts.map((product) => (
        <ProductGridItem 
          key={product.product_id} 
          product={product} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <FilterProvider>
      <div className="w-full">
        <div className="overflow-x-auto scrollbar-thumb-red-600 scrollbar-track-gray-200" style={{ scrollbarWidth: 'auto', minHeight: 12 }}>
          <Suspense fallback={<LoadingProducts />}>
            <ProductsGrid />
          </Suspense>
        </div>
        <style jsx global>{`
          .overflow-x-auto::-webkit-scrollbar {
            height: 12px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #d32f2f;
            border-radius: 6px;
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background: #f3f4f6;
          }
        `}</style>
      </div>
    </FilterProvider>
  );
} 



