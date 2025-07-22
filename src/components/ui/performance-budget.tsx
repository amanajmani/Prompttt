'use client';

import { useEffect, useState } from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface PerformanceBudgetProps {
  className?: string;
  showInDevelopment?: boolean;
}

interface BudgetMetric {
  name: string;
  current: number;
  budget: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
}

/**
 * Performance Budget monitoring component
 * Displays real-time performance metrics against defined budgets
 */
export function PerformanceBudget({
  className,
  showInDevelopment = true,
}: PerformanceBudgetProps) {
  const [metrics, setMetrics] = useState<BudgetMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' && showInDevelopment) {
      setIsVisible(true);
    }

    // Monitor performance metrics
    const checkPerformance = () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const newMetrics: BudgetMetric[] = [
          {
            name: 'First Contentful Paint',
            current: Math.round(
              navigation.loadEventEnd - navigation.fetchStart
            ),
            budget: 2000,
            unit: 'ms',
            status:
              navigation.loadEventEnd - navigation.fetchStart > 2000
                ? 'error'
                : 'good',
          },
          {
            name: 'DOM Content Loaded',
            current: Math.round(
              navigation.domContentLoadedEventEnd - navigation.fetchStart
            ),
            budget: 1500,
            unit: 'ms',
            status:
              navigation.domContentLoadedEventEnd - navigation.fetchStart > 1500
                ? 'warning'
                : 'good',
          },
        ];

        setMetrics(newMetrics);
      }
    };

    // Check performance after page load
    if (document.readyState === 'complete') {
      checkPerformance();
    } else {
      window.addEventListener('load', checkPerformance);
    }

    return () => {
      window.removeEventListener('load', checkPerformance);
    };
  }, [showInDevelopment]);

  if (!isVisible || metrics.length === 0) {
    return null;
  }

  return (
    <Card className={cn('fixed bottom-4 right-4 z-50 w-80 p-4', className)}>
      <h3 className="mb-3 text-sm font-semibold">Performance Budget</h3>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{metric.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs">
                {metric.current}
                {metric.unit} / {metric.budget}
                {metric.unit}
              </span>
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  metric.status === 'good' && 'bg-green-500',
                  metric.status === 'warning' && 'bg-yellow-500',
                  metric.status === 'error' && 'bg-red-500'
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default PerformanceBudget;
