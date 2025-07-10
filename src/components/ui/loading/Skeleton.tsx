'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface SkeletonProps extends PresentationalProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

/**
 * Skeleton variant styles
 */
const skeletonVariants = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded'
}

/**
 * Skeleton Component
 * Single responsibility: Provide loading placeholder with different shapes
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    variant = 'rectangular',
    width,
    height,
    lines = 1,
    className,
    ...props 
  }, ref) => {
    const baseClasses = 'bg-secondary-surface animate-pulse'
    
    // Handle multiple lines for text variant
    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} role="status" aria-label="Loading content" className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                skeletonVariants[variant],
                i === lines - 1 && 'w-3/4' // Last line is shorter
              )}
              style={{
                width: i === lines - 1 ? '75%' : width,
                height: height || '1rem'
              }}
            />
          ))}
        </div>
      )
    }

    // Single skeleton element
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading content"
        className={cn(
          baseClasses,
          skeletonVariants[variant],
          className
        )}
        style={{
          width: width || (variant === 'circular' ? height : '100%'),
          height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? width : '1rem')
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'