import type { Metadata, Viewport } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'Britishce44 | AI Digital School Platform',
  description: 'The First British Center Online — Enterprise AI-Powered Educational Ecosystem',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-sans bg-[#f0f2f5] text-[#0a1628] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
