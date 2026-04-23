import type { Metadata } from 'next';
import { Inter, Merriweather, Mukta } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

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
    alternateLocale: 'en_US',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${merriweather.variable} ${mukta.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider>
            <LanguageProvider>
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
            </LanguageProvider>
          </TooltipProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
