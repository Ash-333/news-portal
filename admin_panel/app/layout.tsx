import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'], 
  variable: '--font-noto-sans-devanagari' 
})

export const metadata: Metadata = {
  title: 'News Portal Admin',
  description: 'Bilingual News Portal Admin Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansDevanagari.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
