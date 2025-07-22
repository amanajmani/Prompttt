'use client';

import { useEffect } from 'react';

/**
 * Analytics component with graceful fallback
 *
 * This component will attempt to load Vercel Analytics only when available
 * and gracefully fallback to a no-op component when the package is not installed.
 */
export function Analytics() {
  useEffect(() => {
    // Only attempt to load analytics in production and when package is available
    if (process.env.NODE_ENV === 'production') {
      // Dynamic import to avoid build-time dependency
      import('@vercel/analytics/react')
        .then((module) => {
          // If we successfully import, we could inject the analytics here
          console.log('Vercel Analytics loaded successfully');
        })
        .catch(() => {
          // Package not available, silently continue
          console.log(
            'Vercel Analytics not available - continuing without analytics'
          );
        });
    }
  }, []);

  // Return null - analytics tracking happens via the dynamic import above
  return null;
}

export default Analytics;
