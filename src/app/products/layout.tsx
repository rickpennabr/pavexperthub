import React from 'react';
import ProductsSearchFilter from '@/components/custom/products-search-filter/ProductsSearchFilter';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <ProductsSearchFilter />
        <main className="mt-6">
          {children}
        </main>
      </div>
    </div>
  );
} 