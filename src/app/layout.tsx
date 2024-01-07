import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import Navbar from '@/components/nav/Navbar.component';
import { Toaster } from '@/components/ui/Toaster.component';
import { cn, constructMetadata } from '@/lib/utils';
import Providers from '@/providers/Providers.provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className='light'>
      <Providers>
        <body
          className={cn(
            'min-h-screen font-sans antialiased grainy',
            inter.className,
          )}
        >
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
