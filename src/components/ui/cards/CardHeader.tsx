'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CardHeaderProps extends PresentationalProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Card header padding sizes
 */
const headerPadding = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4 pb-2',
  lg: 'p-6 pb-3'
}

/**
 * CardHeader Component
 * Single responsibility: Provide consistent card header styling
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          headerPadding[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'