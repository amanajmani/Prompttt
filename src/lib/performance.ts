/**
 * Enterprise-grade Performance Monitoring Utilities
 *
 * Features:
 * - Core Web Vitals tracking (LCP, FID, CLS)
 * - Mobile-specific performance metrics
 * - Touch interaction responsiveness monitoring
 * - Real User Monitoring (RUM) data collection
 * - Performance budget alerts
 */

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    GOOD: 2500, // <= 2.5s
    NEEDS_IMPROVEMENT: 4000, // 2.5s - 4s
  },
  // First Input Delay (FID)
  FID: {
    GOOD: 100, // <= 100ms
    NEEDS_IMPROVEMENT: 300, // 100ms - 300ms
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    GOOD: 0.1, // <= 0.1
    NEEDS_IMPROVEMENT: 0.25, // 0.1 - 0.25
  },
  // Time to First Byte (TTFB)
  TTFB: {
    GOOD: 800, // <= 800ms
    NEEDS_IMPROVEMENT: 1800, // 800ms - 1.8s
  },
  // Touch interaction responsiveness
  TOUCH_RESPONSE: {
    GOOD: 50, // <= 50ms
    NEEDS_IMPROVEMENT: 100, // 50ms - 100ms
  },
} as const;

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  id: string; // Unique identifier for the metric
}

// Touch interaction tracking
export interface TouchInteraction {
  type: 'tap' | 'scroll' | 'swipe' | 'pinch';
  startTime: number;
  endTime: number;
  duration: number;
  target: string;
  successful: boolean;
}

/**
 * Get device type based on screen size and user agent
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  if (
    width <= 768 ||
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  ) {
    return 'mobile';
  } else if (width <= 1024 || /tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  }

  return 'desktop';
}

/**
 * Get connection type for network-aware optimizations
 */
function getConnectionType(): string {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }

  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; type?: string };
    }
  ).connection;
  return connection?.effectiveType || connection?.type || 'unknown';
}

/**
 * Rate performance metric based on thresholds
 */
function rateMetric(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds =
    PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];

  if (!thresholds) return 'good';

  if (value <= thresholds.GOOD) return 'good';
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'poor';
}

/**
 * Track Core Web Vitals using the web-vitals library pattern
 */
function trackWebVitals(onMetric: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
      startTime: number;
    };

    if (lastEntry) {
      const metric: PerformanceMetric = {
        name: 'LCP',
        value: lastEntry.startTime,
        rating: rateMetric('LCP', lastEntry.startTime),
        timestamp: Date.now(),
        url: window.location.href,
        deviceType: getDeviceType(),
        connectionType: getConnectionType(),
        id: `lcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      onMetric(metric);
    }
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // LCP not supported
  }

  // Track FID (First Input Delay)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const eventEntry = entry as PerformanceEntry & {
        processingStart: number;
        startTime: number;
      };
      const metric: PerformanceMetric = {
        name: 'FID',
        value: eventEntry.processingStart - eventEntry.startTime,
        rating: rateMetric(
          'FID',
          eventEntry.processingStart - eventEntry.startTime
        ),
        timestamp: Date.now(),
        url: window.location.href,
        deviceType: getDeviceType(),
        connectionType: getConnectionType(),
        id: `fid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      onMetric(metric);
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // FID not supported
  }

  // Track CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const layoutEntry = entry as PerformanceEntry & {
        hadRecentInput: boolean;
        value: number;
      };
      if (!layoutEntry.hadRecentInput) {
        clsValue += layoutEntry.value;
      }
    });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // CLS not supported
  }

  // Report CLS on page unload
  const reportCLS = () => {
    const metric: PerformanceMetric = {
      name: 'CLS',
      value: clsValue,
      rating: rateMetric('CLS', clsValue),
      timestamp: Date.now(),
      url: window.location.href,
      deviceType: getDeviceType(),
      connectionType: getConnectionType(),
      id: `cls-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    onMetric(metric);
  };

  window.addEventListener('beforeunload', reportCLS);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportCLS();
    }
  });
}

/**
 * Track touch interaction responsiveness
 */
function trackTouchInteractions(
  onInteraction: (interaction: TouchInteraction) => void
) {
  if (typeof window === 'undefined') return;

  let touchStartTime = 0;
  let touchTarget = '';

  const handleTouchStart = (event: TouchEvent) => {
    touchStartTime = performance.now();
    touchTarget =
      (event.target as Element)?.tagName?.toLowerCase() || 'unknown';
  };

  const handleTouchEnd = () => {
    if (touchStartTime === 0) return;

    const endTime = performance.now();
    const duration = endTime - touchStartTime;

    const interaction: TouchInteraction = {
      type: 'tap',
      startTime: touchStartTime,
      endTime,
      duration,
      target: touchTarget,
      successful:
        duration <= PERFORMANCE_THRESHOLDS.TOUCH_RESPONSE.NEEDS_IMPROVEMENT,
    };

    onInteraction(interaction);
    touchStartTime = 0;
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Cleanup function
  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Monitor scroll performance
 */
function trackScrollPerformance(onMetric: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;

  let scrollStartTime = 0;
  let isScrolling = false;

  const handleScrollStart = () => {
    if (!isScrolling) {
      scrollStartTime = performance.now();
      isScrolling = true;
    }
  };

  const handleScrollEnd = () => {
    if (isScrolling) {
      const endTime = performance.now();
      const duration = endTime - scrollStartTime;

      const metric: PerformanceMetric = {
        name: 'SCROLL_RESPONSE',
        value: duration,
        rating:
          duration <= 16
            ? 'good'
            : duration <= 32
              ? 'needs-improvement'
              : 'poor',
        timestamp: Date.now(),
        url: window.location.href,
        deviceType: getDeviceType(),
        connectionType: getConnectionType(),
        id: `scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      onMetric(metric);
      isScrolling = false;
    }
  };

  let scrollTimeout: NodeJS.Timeout;
  const handleScroll = () => {
    handleScrollStart();

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScrollEnd, 150);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
}

/**
 * Performance monitoring hook for React components
 */
function usePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  const reportMetric = (metric: PerformanceMetric) => {
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Vercel Analytics, Google Analytics, or custom endpoint
      console.log('Performance Metric:', metric);
    } else {
      // Development logging
      const emoji =
        metric.rating === 'good'
          ? '✅'
          : metric.rating === 'needs-improvement'
            ? '⚠️'
            : '❌';
      console.log(
        `${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
      );
    }
  };

  const reportInteraction = (interaction: TouchInteraction) => {
    if (process.env.NODE_ENV === 'development') {
      const emoji = interaction.successful ? '✅' : '❌';
      console.log(
        `${emoji} Touch ${interaction.type}: ${interaction.duration.toFixed(2)}ms on ${interaction.target}`
      );
    }
  };

  // Initialize monitoring
  trackWebVitals(reportMetric);
  trackTouchInteractions(reportInteraction);
  trackScrollPerformance(reportMetric);
}

const performanceUtils = {
  trackWebVitals,
  trackTouchInteractions,
  trackScrollPerformance,
  usePerformanceMonitoring,
  getDeviceType,
  getConnectionType,
  rateMetric,
  PERFORMANCE_THRESHOLDS,
};

// Export the reportWebVitals function that matches the expected signature
export const reportWebVitals = (
  onMetric: (metric: PerformanceMetric) => void
) => {
  trackWebVitals(onMetric);
};

// Export performance utilities
export {
  trackWebVitals,
  trackTouchInteractions,
  trackScrollPerformance,
  usePerformanceMonitoring,
  getDeviceType,
  getConnectionType,
  rateMetric,
  PERFORMANCE_THRESHOLDS,
};
export default performanceUtils;
