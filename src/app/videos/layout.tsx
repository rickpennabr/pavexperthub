import { ReactNode } from 'react';
import { FilterProvider } from '@/context/filter-context';
import VideosSearchFilter from '@/components/custom/videos-search-filter/VideosSearchFilter';
import PageContainer from '@/components/layout/PageContainer';

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