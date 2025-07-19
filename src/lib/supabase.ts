import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Supabase client configuration interface
 */
interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Cached Supabase client instance
 */
let supabaseClientInstance: SupabaseClient<Database> | null = null;

/**
 * Validates that all required Supabase environment variables are present
 */
function validateSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return {
    url,
    anonKey,
  };
}

/**
 * Creates and returns a Supabase client instance using lazy initialization.
 * This ensures the client is only created when needed at runtime,
 * preventing build-time failures due to missing environment variables.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  // Return cached instance if available
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  // Validate configuration
  const config = validateSupabaseConfig();

  // Create new client instance
  supabaseClientInstance = createClient<Database>(config.url, config.anonKey);

  return supabaseClientInstance;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getSupabaseClient() instead for better error handling
 */
export const supabase = {
  get client() {
    return getSupabaseClient();
  },
};
