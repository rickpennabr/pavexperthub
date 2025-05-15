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

export default function ProductsSearchFilterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductsPage = pathname === '/products' || pathname.startsWith('/products/');

  return (
    <>
      {isProductsPage && <ProductsSearchFilter />}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
} 