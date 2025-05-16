/**
 * VideosSearchFilterWrapper Component
 * 
 * A wrapper component that conditionally renders the VideosSearchFilter
 * and wraps its children in a PageContainer. The filter is only shown
 * on video-related pages.
 */

'use client';

import { usePathname } from "next/navigation";
import VideosSearchFilter from "./VideosSearchFilter";
import PageContainer from "../../layout/PageContainer";
import { useState, useEffect } from "react";

export default function VideosSearchFilterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const isVideosPage = pathname === '/videos' || pathname.startsWith('/videos/');

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
      {isVideosPage && <VideosSearchFilter />}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
} 