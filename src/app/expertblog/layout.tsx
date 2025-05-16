import React from 'react';
import BlogSearchFilter from '@/components/custom/blog-search-filter/BlogSearchFilter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export default function ExpertBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <BlogSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 