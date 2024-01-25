import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/shared/ThemeProvider';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Welcome to Threads',
  description: 'Threads Authorization',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`bg-background ${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <main className="w-full min-h-screen flex justify-center items-center">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
