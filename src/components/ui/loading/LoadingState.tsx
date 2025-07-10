'use client'

import React from 'react'
import { cn } from '@/utils'
import { LoadingSpinner } from './LoadingSpinner'
import type { PresentationalProps } from '@/patterns'

export interface LoadingStateProps extends PresentationalProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * LoadingState Component
 * Single responsibility: Conditionally render loading state or content
 */
export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ 
    isLoading,
    children,
    fallback,
    spinnerSize = 'md',
    className,
    ...props 
  }, ref) => {
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center p-4', className)}
          {...props}
        >
          {fallback || <LoadingSpinner size={spinnerSize} />}
        </div>
      )
    }

    return <>{children}</>
  }
)

LoadingState.displayName = 'LoadingState'