import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ResponsiveValue {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveValue | number;
  gap?: ResponsiveValue | number;
  children: React.ReactNode;
}

/**
 * Enterprise-grade responsive Grid component
 *
 * Features:
 * - Responsive column configuration across all breakpoints
 * - Responsive gap configuration
 * - CSS Grid-based for optimal performance
 * - Type-safe responsive value system
 * - Accessible and semantic HTML structure
 */
const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, gap = 4, className, children, ...props }, ref) => {
    // Generate responsive column classes
    const getColumnClasses = (colsValue: ResponsiveValue | number): string => {
      if (typeof colsValue === 'number') {
        return `grid-cols-${colsValue}`;
      }

      const classes: string[] = [];

      // Base mobile-first approach
      if (colsValue.sm) classes.push(`grid-cols-${colsValue.sm}`);
      if (colsValue.md) classes.push(`md:grid-cols-${colsValue.md}`);
      if (colsValue.lg) classes.push(`lg:grid-cols-${colsValue.lg}`);
      if (colsValue.xl) classes.push(`xl:grid-cols-${colsValue.xl}`);
      if (colsValue['2xl']) classes.push(`2xl:grid-cols-${colsValue['2xl']}`);

      return classes.join(' ');
    };

    // Generate responsive gap classes
    const getGapClasses = (gapValue: ResponsiveValue | number): string => {
      if (typeof gapValue === 'number') {
        return `gap-${gapValue}`;
      }

      const classes: string[] = [];

      if (gapValue.sm) classes.push(`gap-${gapValue.sm}`);
      if (gapValue.md) classes.push(`md:gap-${gapValue.md}`);
      if (gapValue.lg) classes.push(`lg:gap-${gapValue.lg}`);
      if (gapValue.xl) classes.push(`xl:gap-${gapValue.xl}`);
      if (gapValue['2xl']) classes.push(`2xl:gap-${gapValue['2xl']}`);

      return classes.join(' ');
    };

    const columnClasses = getColumnClasses(cols);
    const gapClasses = getGapClasses(gap);

    return (
      <div
        ref={ref}
        className={cn('grid', columnClasses, gapClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export { Grid, type GridProps, type ResponsiveValue };
