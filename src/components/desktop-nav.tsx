'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

interface DesktopNavProps {
  items: NavItem[];
  className?: string;
}

/**
 * Desktop navigation component
 *
 * Features:
 * - Horizontal navigation menu for desktop screens
 * - Active state highlighting based on current route
 * - Smooth hover transitions
 * - External link support with proper attributes
 * - Proper focus states for accessibility
 * - Hidden on mobile screens
 * - Dual-theme support
 */
export function DesktopNav({ items, className }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('hidden md:flex md:items-center md:space-x-6', className)}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
              isActive ? 'text-foreground' : 'text-foreground/60'
            )}
            {...(item.external && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
