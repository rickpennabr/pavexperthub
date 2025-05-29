'use client';

import AppContainer from "@/components/layout/AppContainer";
import Header from "@/components/layout/Header";
import MainMenu from "@/components/layout/MainMenu";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Match /products/[id] but not /products or /products/
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);

  return (
    <AppContainer>
      <div className={`h-full ${isProductDetail ? 'hidden md:block' : ''}`}>
        <Header />
        <MainMenu />
      </div>
      <div className="h-full">
        {children}
      </div>
    </AppContainer>
  );
} 