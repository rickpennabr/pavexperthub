import React from 'react';
import VideosSearchFilter from '@/components/custom/videos-search-filter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <VideosSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 