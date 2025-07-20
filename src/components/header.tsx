'use client';

import { Container } from '@/components';

interface HeaderProps {
  children: React.ReactNode;
}

/**
 * Main site header component
 *
 * Features:
 * - Sticky positioning at top of viewport
 * - Responsive container layout
 * - Flexbox layout with logo left, actions right
 * - Bottom border for visual separation
 * - Dual-theme support
 */
export function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between">{children}</div>
      </Container>
    </header>
  );
}
