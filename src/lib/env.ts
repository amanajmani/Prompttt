// Environment variables validation and type safety

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnvVar(
  name: string,
  defaultValue?: string
): string | undefined {
  return process.env[name] || defaultValue
}

// Server-side environment variables
export const env = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),

  // Supabase
  SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  // Google OAuth
  GOOGLE_CLIENT_ID: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),

  // Cloudflare R2
  R2_ACCOUNT_ID: getOptionalEnvVar('R2_ACCOUNT_ID'),
  R2_ACCESS_KEY_ID: getOptionalEnvVar('R2_ACCESS_KEY_ID'),
  R2_SECRET_ACCESS_KEY: getOptionalEnvVar('R2_SECRET_ACCESS_KEY'),
  R2_BUCKET_NAME: getOptionalEnvVar('R2_BUCKET_NAME'),
  R2_PUBLIC_URL: getOptionalEnvVar('R2_PUBLIC_URL'),
  R2_IMAGES_BUCKET_NAME: getOptionalEnvVar('R2_IMAGES_BUCKET_NAME'),
  R2_IMAGES_PUBLIC_URL: getOptionalEnvVar('R2_IMAGES_PUBLIC_URL'),
} as const

// Client-side environment variables
export const clientEnv = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  DEV_MODE: getOptionalEnvVar('NEXT_PUBLIC_DEV_MODE') === 'true',
} as const

// Type-safe environment check
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}
