'use client';

import { useEffect } from 'react';
import { reportWebVitals, type PerformanceMetric } from '@/lib/performance';

/**
 * Performance monitoring component for Core Web Vitals
 * Tracks LCP, FID, CLS, and other performance metrics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Report web vitals in development for immediate feedback
    if (process.env.NODE_ENV === 'development') {
      reportWebVitals((metric: PerformanceMetric) => {
        console.log('Web Vital:', metric);
      });
    }

    // Report to analytics in production
    if (process.env.NODE_ENV === 'production') {
      reportWebVitals((metric: PerformanceMetric) => {
        // Send to analytics service (Vercel Analytics will be added)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            custom_map: { metric_id: 'web_vitals' },
            value: Math.round(
              metric.name === 'CLS' ? metric.value * 1000 : metric.value
            ),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }
      });
    }
  }, []);

  return null;
}
