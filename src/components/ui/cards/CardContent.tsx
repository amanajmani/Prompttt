'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CardContentProps extends PresentationalProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Card content padding sizes
 */
const contentPadding = {
  none: 'p-0',
  sm: 'p-3 pt-0',
  md: 'p-4 pt-0',
  lg: 'p-6 pt-0'
}

/**
 * CardContent Component
 * Single responsibility: Provide main card content area with consistent spacing
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          contentPadding[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'