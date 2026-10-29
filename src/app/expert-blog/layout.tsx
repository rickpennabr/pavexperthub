import type { Metadata } from 'next';
import React from 'react';
import BlogSearchFilter from '@/components/custom/blog-page/blog-search-filter/BlogSearchFilter';
import PageContainer from '@/components/layout/PageContainer';
import { FilterProvider } from '@/context/filter-context';

export const metadata: Metadata = {
  title: "Paver Guides",
  robots: { index: false, follow: true },
};

export default function BlogLayout({
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