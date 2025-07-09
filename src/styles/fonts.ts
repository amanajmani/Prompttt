// Font configurations for the design system

import { Inter, JetBrains_Mono } from 'next/font/google'

// Satoshi will be loaded from Fontshare (external)
// Inter for body text - highly legible UI font
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// JetBrains Mono for prompts and code - clean, readable monospace
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

// Font family CSS variables for Tailwind
export const fontVariables = `
  ${inter.variable}
  ${jetbrainsMono.variable}
`
