/**
 * BlogSearchFilterWrapper Component
 * 
 * A wrapper component that conditionally renders the BlogSearchFilter
 * and wraps its children in a PageContainer. The filter is only shown
 * on blog-related pages.
 */

'use client';

import { usePathname } from "next/navigation";
import BlogSearchFilter from "./BlogSearchFilter";
import PageContainer from "../../layout/PageContainer";
import { useState, useEffect } from "react";

export default function BlogSearchFilterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const isBlogPage = pathname === '/expertblog' || pathname.startsWith('/expertblog/');

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
      {isBlogPage && <BlogSearchFilter />}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
} 