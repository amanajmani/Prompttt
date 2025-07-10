'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface AspectRatioProps extends PresentationalProps {
  ratio?: number | string
  asChild?: boolean
}

/**
 * AspectRatio Component
 * Single responsibility: Maintain consistent aspect ratios for content
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, asChild = false, className, children, ...props }, ref) => {
    const aspectRatioValue = typeof ratio === 'number' ? `${ratio}` : ratio

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{ aspectRatio: aspectRatioValue }}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <div className="absolute inset-0">
            {children}
          </div>
        )}
      </div>
    )
  }
)

AspectRatio.displayName = 'AspectRatio'