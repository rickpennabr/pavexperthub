import React from 'react';
import ProductsSearchFilter from '@/components/custom/products-search-filter/ProductsSearchFilter';
import PageContainer from '@/components/layout/PageContainer';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProductsSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
} 