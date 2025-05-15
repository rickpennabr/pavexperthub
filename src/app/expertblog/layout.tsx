import React from 'react';
import PageContainer from '@/components/layout/PageContainer';

export default function ExpertBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        {children}
      </PageContainer>
    </div>
  );
} 