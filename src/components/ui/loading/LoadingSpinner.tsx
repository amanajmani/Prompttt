'use client'

import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'
import type { PresentationalProps } from '@/patterns'

export interface LoadingSpinnerProps extends PresentationalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'accent' | 'muted'
}

/**
 * Spinner size configurations
 */
const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

/**
 * Spinner color variants
 */
const spinnerVariants = {
  default: 'text-high',
  accent: 'text-accent',
  muted: 'text-medium'
}

/**
 * LoadingSpinner Component
 * Single responsibility: Provide animated loading indicator
 */
export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={cn(
          'inline-flex items-center justify-center',
          className
        )}
        {...props}
      >
        <Loader2 
          className={cn(
            'animate-spin',
            spinnerSizes[size],
            spinnerVariants[variant]
          )}
          aria-hidden="true"
        />
      </div>
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'