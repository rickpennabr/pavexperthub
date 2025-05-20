'use client';

import React from 'react';
import ProductsSearchFilter from '@/components/custom/products-page/products-search-filter/ProductsSearchFilter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <ProductsSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 