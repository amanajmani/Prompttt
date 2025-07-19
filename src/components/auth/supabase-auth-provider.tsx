'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import type { Database } from '@/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize Supabase client on the client side
    if (typeof window !== 'undefined' && !supabaseClient) {
      const client = createClientComponentClient<Database>();
      setSupabaseClient(client);
      setIsInitialized(true);
    }
  }, [supabaseClient]);

  // Don't render the provider until the client is initialized
  if (!isInitialized || !supabaseClient) {
    return <>{children}</>;
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
