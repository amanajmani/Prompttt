import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { User, LogIn } from 'lucide-react';
import { getServerUser } from '@/lib/auth';

/**
 * Enterprise-grade Server Component authentication navigation
 *
 * Features:
 * - Zero hydration mismatches (Server Component)
 * - No client-side auth state management
 * - Perfect SSR/client consistency
 * - Follows Next.js 13+ best practices
 */
export async function ServerAuthNav() {
  // Get auth state on the server - no client-side complexity
  const user = await getServerUser();

  // Authenticated state - rendered on server, no hydration issues
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

  // Unauthenticated state - rendered on server, no hydration issues
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
