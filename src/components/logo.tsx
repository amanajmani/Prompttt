'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * Site logo component
 *
 * Features:
 * - Clickable link to home page
 * - Bold typography with brand styling
 * - Responsive text sizing
 * - Proper focus states for accessibility
 * - Dual-theme support
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center space-x-2 text-xl font-bold transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        className
      )}
      aria-label="PROMPTTT - Home"
    >
      <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        PROMPTTT
      </span>
    </Link>
  );
}
