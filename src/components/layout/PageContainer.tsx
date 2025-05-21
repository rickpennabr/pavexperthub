/**
 * PageContainer Component
 * 
 * A layout component that provides a consistent container for page content.
 * Wraps its children in a main element with standard styling for content
 * display and scrolling behavior.
 */

'use client';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="h-full min-h-[calc(100vh-120px)] flex-1 w-full bg-black overflow-auto">
      {children}
    </main>
  );
}
