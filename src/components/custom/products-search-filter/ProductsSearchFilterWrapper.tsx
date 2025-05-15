/**
 * ProductsSearchFilterWrapper Component
 * 
 * A wrapper component that conditionally renders the ProductsSearchFilter
 * and wraps its children in a PageContainer. The filter is only shown
 * on product-related pages.
 */

'use client';

import { usePathname } from "next/navigation";
import ProductsSearchFilter from "./ProductsSearchFilter";
import PageContainer from "../../layout/PageContainer";
import { useState, useEffect } from "react";

export default function ProductsSearchFilterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const isProductsPage = pathname === '/products' || pathname.startsWith('/products/');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while client-side code is hydrating
  if (!isClient) {
    return (
      <PageContainer>
        <div className="w-full h-[60px] bg-gray-200 animate-pulse"></div>
        {children}
      </PageContainer>
    );
  }

  return (
    <>
      {isProductsPage && <ProductsSearchFilter />}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
} 