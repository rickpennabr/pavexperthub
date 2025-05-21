'use client';

import React from 'react';
import ProductsSearchFilter from '@/components/custom/products-page/products-search-filter/ProductsSearchFilter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';
import { usePathname } from 'next/navigation';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Match /products/[id] but not /products or /products/
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);

  return (
    <FilterProvider>
      <div className={isProductDetail ? 'hidden md:block' : ''}>
        <ProductsSearchFilter />
      </div>
      <div className={isProductDetail ? 'hidden md:block' : ''}>
        <PageContainer>
          {children}
        </PageContainer>
      </div>
      {/* On detail page, show children without header/filter on mobile */}
      {isProductDetail && (
        <div className="block md:hidden">
          {children}
        </div>
      )}
    </FilterProvider>
  );
} 