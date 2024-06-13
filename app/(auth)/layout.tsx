import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/shared/ThemeProvider';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Welcome to Threads',
  description: 'Threads Authorization',
  openGraph: {
    title: 'Threads - Share your thoughts',
    description:
      'Share your thoughts, follow interesting people and topics, engage in real-time discussions',
    siteName: 'Threads APP',
    type: 'website',
    images: [
      {
        url: 'https://threads-eight-tan.vercel.app/icons/icon-512.svg',
        width: 512,
        height: 512,
      },
    ],
  },
  icons: {
    icon: {
      url: 'https://threads-eight-tan.vercel.app/icons/icon.svg',
      type: 'image/svg+xml',
    },
    shortcut: {
      url: 'https://threads-eight-tan.vercel.app/icons/favicon.ico',
      type: 'image/ico',
    },
  },
};

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
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
