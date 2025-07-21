'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { User, LogIn } from 'lucide-react';
import { useWorldClassAuth } from './supabase-auth-provider';

/**
 * World-class authentication navigation component
 *
 * Features:
 * - Zero visual flashing or hydration mismatches
 * - Server-side auth state consistency
 * - Optimistic UI patterns
 * - Enterprise-grade user experience
 */
export function WorldClassAuthNav() {
  const { user, isLoading } = useWorldClassAuth();

  // During loading (should be rare with server state), show neutral state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-20 animate-pulse rounded bg-muted/50" />
        <div className="h-10 w-16 animate-pulse rounded bg-muted/50" />
      </div>
    );
  }

  // Authenticated state - no flashing because server provides initial state
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <User className="h-4 w-4" />
          <span>Welcome back!</span>
        </div>
        <LogoutButton />
      </div>
    );
  }

  // Unauthenticated state - no flashing because server provides initial state
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
