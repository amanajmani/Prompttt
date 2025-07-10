'use client'

import React from 'react'
import { cn } from '@/utils'
import { LoadingSpinner } from './LoadingSpinner'
import type { PresentationalProps } from '@/patterns'

export interface PageLoadingProps extends PresentationalProps {
  message?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * PageLoading Component
 * Single responsibility: Provide full-page loading state
 */
export const PageLoading = React.forwardRef<HTMLDivElement, PageLoadingProps>(
  ({ message = 'Loading...', size = 'lg', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center min-h-[400px] space-y-4',
          className
        )}
        {...props}
      >
        <LoadingSpinner size={size} />
        {message && (
          <p className="text-medium text-sm">{message}</p>
        )}
      </div>
    )
  }
)

PageLoading.displayName = 'PageLoading'