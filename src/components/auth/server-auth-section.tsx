import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';
import { getServerUser } from '@/lib/auth';
import { ClientLogoutButton } from './client-logout-button';

/**
 * Server Component for authentication section
 *
 * This renders the correct auth state on the server, eliminating
 * the 1-second flash between sign-in and sign-out states.
 *
 * Uses Server Components for static content and Client Components
 * only for interactive elements (logout button).
 */
export async function ServerAuthSection() {
  // Get user state on server - no client-side delays or flashing
  const user = await getServerUser();

  // Authenticated state - rendered on server with correct state
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <User className="h-4 w-4" />
          <span>Welcome back!</span>
        </div>
        {/* Only the logout button needs to be interactive (client component) */}
        <ClientLogoutButton />
      </div>
    );
  }

  // Unauthenticated state - rendered on server with correct state
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
