import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  ThemeProvider,
  Header,
  Logo,
  DesktopNav,
  ThemeToggle,
  Footer,
} from '@/components';
import { Toaster } from '@/components/ui/toaster';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from '@/components/ui';
import { WorldClassAuthProvider } from '@/components/auth/supabase-auth-provider';
import { WorldClassAuthNav } from '@/components/auth/world-class-auth-nav';
import { Menu } from 'lucide-react';
import PerformanceMonitor from './performance-monitor';
import PerformanceBudget from '@/components/ui/performance-budget';

// Analytics component - will be null if package not installed
// Create Analytics component with proper error handling
function createAnalyticsComponent(): React.ComponentType {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Analytics: VercelAnalytics } = require('@vercel/analytics/react');
    const AnalyticsComponent = () => <VercelAnalytics />;
    AnalyticsComponent.displayName = 'VercelAnalytics';
    return AnalyticsComponent;
  } catch {
    // Package not installed, use null component
    const NullComponent = () => null;
    NullComponent.displayName = 'NullAnalytics';
    return NullComponent;
  }
}

const Analytics = createAnalyticsComponent();

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create default auth state for static generation
  // The WorldClassAuthProvider will handle real auth state on the client
  const defaultAuthState = {
    user: null,
    session: null,
    isLoading: false,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen overflow-x-hidden bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable,
          satoshi.variable
        )}
        suppressHydrationWarning
      >
        <WorldClassAuthProvider initialAuthState={defaultAuthState}>
          <PerformanceMonitor />
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

                {/* World-Class Auth Section - No Flashing */}
                <WorldClassAuthNav />

                {/* Mobile Navigation Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      aria-label="Open mobile menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {/* Mobile Navigation Links */}
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-sm py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* Mobile Auth Section */}
                      <div className="border-t pt-4">
                        <WorldClassAuthNav />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </Header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Site Footer */}
            <Footer />

            <Toaster />
          </ThemeProvider>
        </WorldClassAuthProvider>
        <Analytics />
        <PerformanceBudget />
      </body>
    </html>
  );
}
