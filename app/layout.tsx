import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Spine Aid - Connecting Communities for Spinal Cord Injury Support',
  description: 'Raising awareness of spinal cord injuries while coordinating in-kind donations of wheelchairs, mobility aids, and medical supplies.',
  keywords: ['spinal cord injury', 'donations', 'wheelchairs', 'mobility aids', 'medical supplies', 'community support'],
  authors: [{ name: 'Spine Aid' }],
  openGraph: {
    title: 'Spine Aid - Connecting Communities',
    description: 'Coordinating in-kind donations for spinal cord injury support',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Providers>
          <Navigation />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}


