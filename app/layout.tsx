import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resonance - Sync Music Across Devices',
  description: 'Play music across your Apple devices in sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
