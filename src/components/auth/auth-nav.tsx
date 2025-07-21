'use client';

import Link from 'next/link';
import { useUser, useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { User, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Enterprise-grade authentication navigation component
 *
 * Features:
 * - Prevents hydration mismatches with proper mounting detection
 * - Real-time auth state synchronization
 * - Smooth transitions without flashing
 * - Optimistic UI patterns
 */
export function AuthNav() {
  const user = useUser();
  const session = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show skeleton during SSR and initial hydration
  if (!isMounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-20 animate-pulse rounded bg-muted/30" />
        <div className="h-10 w-16 animate-pulse rounded bg-muted/30" />
      </div>
    );
  }

  // Authenticated state - real-time sync with Supabase
  if (user && session) {
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

  // Unauthenticated state
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
