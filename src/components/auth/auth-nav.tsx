'use client';

import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { User, LogIn } from 'lucide-react';

export function AuthNav() {
  const user = useUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Welcome back!</span>
        </div>
        <LogoutButton />
      </div>
    );
  }

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
