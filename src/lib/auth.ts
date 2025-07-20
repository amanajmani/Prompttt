import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Database } from '@/types/database';

/**
 * World-class server-side authentication utilities
 * 
 * Provides cached, optimized auth state for Server Components
 * with zero client-side flashing.
 */

/**
 * Get the current session on the server side
 * Cached to prevent multiple calls within the same request
 */
export const getServerSession = cache(async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
});

/**
 * Get the current user on the server side
 * Cached to prevent multiple calls within the same request
 */
export const getServerUser = cache(async () => {
  const session = await getServerSession();
  return session?.user ?? null;
});

/**
 * Check if user is authenticated on the server side
 * Cached to prevent multiple calls within the same request
 */
export const isAuthenticated = cache(async () => {
  const session = await getServerSession();
  return !!session;
});

/**
 * Get user profile from database on the server side
 * Cached to prevent multiple calls within the same request
 */
export const getServerUserProfile = cache(async () => {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = createServerComponentClient<Database>({ cookies });
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
});

/**
 * Auth state for client components
 * This ensures consistent auth state without flashing
 */
export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
}

/**
 * Create initial auth state for client hydration
 * This prevents auth state flashing by providing server state to client
 */
export async function createInitialAuthState(): Promise<AuthState> {
  const session = await getServerSession();
  
  return {
    user: session?.user ?? null,
    session,
    isLoading: false, // Server-side is never loading
  };
}