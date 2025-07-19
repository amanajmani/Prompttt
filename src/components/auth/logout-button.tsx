'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({ 
  variant = 'outline', 
  size = 'default',
  className 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  // Only show the button if user is authenticated
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      // Redirect to homepage after successful logout
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}