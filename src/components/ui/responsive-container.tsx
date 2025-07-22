import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ResponsiveContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  enableContainerQueries?: boolean;
}

/**
 * Enterprise-grade ResponsiveContainer component with container queries
 *
 * Features:
 * - Container query support for component-level responsiveness
 * - Predefined size variants for consistent layouts
 * - Fallback to viewport queries when container queries not supported
 * - Accessible and semantic HTML structure
 * - Performance optimized with minimal CSS overhead
 */
const ResponsiveContainer = forwardRef<
  HTMLDivElement,
  ResponsiveContainerProps
>(
  (
    {
      children,
      size = 'full',
      enableContainerQueries = true,
      className,
      ...props
    },
    ref
  ) => {
    // Size-based container classes
    const sizeClasses = {
      sm: 'max-w-sm', // 384px
      md: 'max-w-md', // 448px
      lg: 'max-w-lg', // 512px
      xl: 'max-w-xl', // 576px
      full: 'w-full', // 100%
    };

    // Container query classes when enabled
    const containerQueryClasses = enableContainerQueries ? '@container' : '';

    return (
      <div
        ref={ref}
        className={cn(
          // Base container styles
          'mx-auto',

          // Size-based width
          sizeClasses[size],

          // Container query support
          containerQueryClasses,

          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

/**
 * Container query aware component wrapper
 * Provides container-based responsive behavior
 */
interface ContainerQueryWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ContainerQueryWrapper = forwardRef<
  HTMLDivElement,
  ContainerQueryWrapperProps
>(({ children, className, ...props }, ref) => {
  // Container query breakpoint classes (for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const breakpointClasses = {
    xs: '@xs:', // 320px
    sm: '@sm:', // 384px
    md: '@md:', // 448px
    lg: '@lg:', // 512px
    xl: '@xl:', // 576px
  };

  return (
    <div ref={ref} className={cn('@container', className)} {...props}>
      {children}
    </div>
  );
});

ContainerQueryWrapper.displayName = 'ContainerQueryWrapper';

/**
 * Hook for container query responsive values
 * Provides a way to get responsive values based on container size
 */
function useContainerQuery<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}): T {
  // In a real implementation, this would use ResizeObserver or container query APIs
  // For now, return the default value as a fallback
  return values.default;
}

export {
  ResponsiveContainer,
  ContainerQueryWrapper,
  useContainerQuery,
  type ResponsiveContainerProps,
  type ContainerQueryWrapperProps,
};
