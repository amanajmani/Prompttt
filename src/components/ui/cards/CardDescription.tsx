'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CardDescriptionProps extends PresentationalProps {
  size?: 'sm' | 'md'
  muted?: boolean
}

/**
 * Card description sizes
 */
const descriptionSizes = {
  sm: 'text-xs',
  md: 'text-sm'
}

/**
 * CardDescription Component
 * Single responsibility: Provide consistent card description styling
 */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ size = 'md', muted = true, className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          descriptionSizes[size],
          muted ? 'text-medium' : 'text-high',
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'