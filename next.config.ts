import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    // Ensure environment variables are available during build
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default nextConfig;
