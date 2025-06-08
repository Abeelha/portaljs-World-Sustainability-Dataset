import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/lib/theme-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import FloatingThemeToggle from '@/components/layout/FloatingThemeToggle';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "World Sustainability Data Portal",
  description: "Comprehensive sustainability data portal with AI-powered insights for 173 countries over 19 years",
};

const SkeletonLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-black">
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 dark:bg-gray-800"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased transition-colors duration-500">
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<SkeletonLoader />}>
              {children}
            </Suspense>
          </ErrorBoundary>
          <FloatingThemeToggle />
        </ThemeProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
