'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Database } from '@/types/database';
import type { AuthState } from '@/lib/auth';

interface WorldClassAuthProviderProps {
  children: React.ReactNode;
  initialAuthState: AuthState;
}

/**
 * World-class authentication context
 * 
 * Provides auth state that never flashes or causes hydration mismatches.
 * Uses server-side initial state for perfect SSR/client consistency.
 */
const WorldClassAuthContext = createContext<AuthState | null>(null);

export function WorldClassAuthProvider({ 
  children, 
  initialAuthState 
}: WorldClassAuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const supabaseClient = createClientComponentClient<Database>();

  useEffect(() => {
    // Listen for auth changes and update state
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  return (
    <WorldClassAuthContext.Provider value={authState}>
      <SessionContextProvider 
        supabaseClient={supabaseClient}
        initialSession={initialAuthState.session}
      >
        {children}
      </SessionContextProvider>
    </WorldClassAuthContext.Provider>
  );
}

/**
 * Hook to access world-class auth state
 * 
 * This hook provides auth state that never causes flashing
 * and is always consistent between server and client.
 */
export function useWorldClassAuth(): AuthState {
  const context = useContext(WorldClassAuthContext);
  if (!context) {
    throw new Error('useWorldClassAuth must be used within WorldClassAuthProvider');
  }
  return context;
}

// Clean, simple provider - no complex state management
export function SupabaseAuthProvider({ 
  children
}: { children: React.ReactNode }) {
  const supabaseClient = createClientComponentClient<Database>();

  return (
    <SessionContextProvider 
      supabaseClient={supabaseClient}
    >
      {children}
    </SessionContextProvider>
  );
}
