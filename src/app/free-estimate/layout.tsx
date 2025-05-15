import React from 'react';
import PageContainer from '@/components/layout/PageContainer';

export default function FreeEstimateLayout({
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