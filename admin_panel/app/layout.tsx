import type { Metadata } from 'next'
import { Inter, Mukta } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mukta = Mukta({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-mukta'
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
      <body className={`${inter.variable} ${mukta.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
