'use client';

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 