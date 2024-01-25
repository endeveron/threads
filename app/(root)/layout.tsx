import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import BottomBar from '@/components/shared/BottomBar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Topbar from '@/components/shared/TopBar';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads App',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`bg-background ${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />
              <section className="main-container">
                <div className="content-wrapper w-full max-w-4xl">
                  {children}
                </div>
              </section>
              <RightSidebar />
            </main>
            <BottomBar />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
