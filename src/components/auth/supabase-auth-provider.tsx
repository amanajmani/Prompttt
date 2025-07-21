'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
  initialAuthState,
}: WorldClassAuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Only create Supabase client if environment variables are available
  const supabaseClient = useMemo(() => {
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return createClientComponentClient<Database>();
    }
    return null;
  }, []);

  useEffect(() => {
    // Skip if no Supabase client (missing env vars or SSR)
    if (!supabaseClient) return;

    // Get initial session on client mount
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
        });
      } catch (error) {
        console.warn('Failed to get initial session:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
        });
      }
    };

    getInitialSession();

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
      {supabaseClient ? (
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialAuthState.session}
        >
          {children}
        </SessionContextProvider>
      ) : (
        children
      )}
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
    throw new Error(
      'useWorldClassAuth must be used within WorldClassAuthProvider'
    );
  }
  return context;
}

// Clean, simple provider - no complex state management
export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize the client to prevent recreation on every render
  const supabaseClient = useMemo(
    () => createClientComponentClient<Database>(),
    []
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
