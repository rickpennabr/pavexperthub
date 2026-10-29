'use client';

import AppContainer from "@/components/layout/AppContainer";
import Header from "@/components/layout/Header";
import MainMenu from "@/components/layout/MainMenu";
import { CustomerSessionProvider } from "@/components/auth/customer-session";
import { SeoFooter } from "@/components/seo/seo-footer";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // The admin panel is a full-screen app, outside the public 1080px frame.
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  // Manage account has its own header. It does not use the home header or main menu.
  if (pathname === '/account' || pathname.startsWith('/account/')) {
    return (
      <CustomerSessionProvider>
        <AppContainer>{children}</AppContainer>
      </CustomerSessionProvider>
    );
  }
  // Match /products/[id] but not /products or /products/
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);

  return (
    <CustomerSessionProvider>
      <AppContainer>
        <div className={isProductDetail ? 'hidden md:block' : ''}>
          <Header />
          <MainMenu />
        </div>
        {children}
        <SeoFooter />
      </AppContainer>
    </CustomerSessionProvider>
  );
} 