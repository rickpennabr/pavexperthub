import React from 'react';
import ServicesSearchFilter from '@/components/custom/service-search-filter/ServicesSearchFilter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <ServicesSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 