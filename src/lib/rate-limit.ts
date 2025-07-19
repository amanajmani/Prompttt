import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client for rate limiting with error handling
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn('Redis initialization failed, rate limiting will be disabled:', error);
}

// Create rate limiter instances for different endpoints
export const authRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests per 10 seconds
  analytics: true,
  prefix: 'auth',
}) : null;

export const uploadRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute for uploads
  analytics: true,
  prefix: 'upload',
}) : null;

export const generalRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'), // 30 requests per minute for general API
  analytics: true,
  prefix: 'general',
}) : null;

// Helper function to get client IP address
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

// Rate limit middleware function
export async function withRateLimit(
  request: Request,
  rateLimiter: Ratelimit | null,
  identifier?: string
) {
  // If rate limiter is not available (Redis not configured), allow all requests
  if (!rateLimiter) {
    console.warn('Rate limiting disabled - Redis not configured');
    return {
      success: true,
      limit: 1000,
      reset: Date.now() + 60000,
      remaining: 999,
      headers: {
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '999',
        'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
      },
    };
  }

  const ip = identifier || getClientIP(request);
  const { success, limit, reset, remaining } = await rateLimiter.limit(ip);
  
  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    },
  };
}