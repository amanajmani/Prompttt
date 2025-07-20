'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

/**
 * Client Component for logout functionality
 * 
 * This is the ONLY part that needs to be a client component
 * since it handles user interaction (logout click).
 * 
 * Separated from the main auth display to minimize client-side
 * JavaScript and eliminate hydration issues.
 */
export function ClientLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      // Force a complete page reload to ensure clean state
      window.location.href = '/';
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}