import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { FilterProvider } from '@/context/filter-context';
import VideosSearchFilter from '@/components/custom/videos-search-filter/VideosSearchFilter';
import PageContainer from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: "Paver Videos",
  robots: { index: false, follow: true },
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <FilterProvider>
      <VideosSearchFilter />
      <PageContainer>
        {children}
      </PageContainer>
    </FilterProvider>
  );
} 