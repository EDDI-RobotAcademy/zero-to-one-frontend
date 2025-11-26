import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zero to One',
  description: 'Created with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-body">
        {children}
      </body>
    </html>
  )
}
