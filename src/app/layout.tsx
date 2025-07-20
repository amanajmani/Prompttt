import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  ThemeProvider,
  Header,
  Logo,
  DesktopNav,
  MobileNav,
  ThemeToggle,
} from '@/components';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/components/auth/supabase-auth-provider';
import { AuthNav } from '@/components/auth/auth-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-heading',
  weight: '300 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI VideoHub',
  description:
    "The definitive, curated gallery for the world's best AI-generated video art",
};

// Navigation items configuration
const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable,
          satoshi.variable
        )}
      >
        <SupabaseAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Site Header with Navigation */}
            <Header>
              {/* Left side - Logo */}
              <Logo />

              {/* Right side - Navigation and Actions */}
              <div className="flex items-center space-x-4">
                {/* Desktop Navigation */}
                <DesktopNav items={navigationItems} />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Auth Navigation */}
                <AuthNav />

                {/* Mobile Navigation */}
                <MobileNav>
                  <div className="space-y-4">
                    {/* Mobile Navigation Links */}
                    {navigationItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ))}

                    {/* Mobile Auth Section */}
                    <div className="border-t pt-4">
                      <AuthNav />
                    </div>
                  </div>
                </MobileNav>
              </div>
            </Header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            <Toaster />
          </ThemeProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
