import type { Metadata } from 'next';
import { Mukta } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';
import { BreakingNewsTicker } from '@/components/layout/BreakingNewsTicker';
import { FloatingWatchButton } from '@/components/ui/FloatingWatchButton';
import { FlashNewsSheet } from '@/components/ui/FlashNewsSheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoogleAnalytics } from '@next/third-parties/google';

const mukta = Mukta({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-mukta',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: {
    default: 'HTC Media - Your Trusted Source for News',
    template: '%s | HTC Media',
  },
  description: 'Latest news, breaking news, and in-depth analysis from Nepal and around the world.',
  keywords: ['Nepal news', 'breaking news', 'Nepali news', 'politics', 'sports', 'business'],
  authors: [{ name: 'HTC Media' }],
  creator: 'HTC Media',
  publisher: 'HTC Media',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ne_NP',
    url: SITE_URL,
    siteName: 'HTC Media',
    title: 'HTC Media - Your Trusted Source for News',
    description: 'Latest news, breaking news, and in-depth analysis from Nepal and around the world.',
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'HTC Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nepalinews',
    creator: '@nepalinews',
    title: 'HTC Media - Your Trusted Source for News',
    description: 'Latest news, breaking news, and in-depth analysis from Nepal and around the world.',
    images: [`${SITE_URL}/images/twitter-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 1. Preconnect to your Cloudflare R2 bucket for faster image/banner loading (~90ms savings) */}
        <link 
          rel="preconnect" 
          href="https://pub-0b3a31472a884459a6924728f1b443e3.r2.dev" 
          crossOrigin="anonymous" 
        />

        {/* 2. Optional: Preload the absolute slowest font file from your initial audit report */}
        {/* Replace this specific file name if the hash string changes upon your next project build */}
        <link
          rel="preload"
          href="/_next/static/media/f149253a5c6880ff-s.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${mukta.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider>
            <QueryProvider>
              <AuthProvider>
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <div className="flex min-h-screen flex-col">
                  <Suspense fallback={<div className="bg-news-red text-white py-2" />}>
                    <TopBar />
                  </Suspense>
                  <Header />
                  <BreakingNewsTicker />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <MobileBottomBar />
                  <FloatingWatchButton />
                  <FlashNewsSheet />
                </div>
              </AuthProvider>
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}