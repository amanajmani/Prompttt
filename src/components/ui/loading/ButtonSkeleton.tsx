'use client'

import React from 'react'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'
import type { PresentationalProps } from '@/patterns'

export interface ButtonSkeletonProps extends PresentationalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

/**
 * Button skeleton sizes
 */
const buttonSkeletonSizes = {
  sm: 'h-8 w-20',
  md: 'h-10 w-24',
  lg: 'h-12 w-28',
  xl: 'h-14 w-32'
}

/**
 * ButtonSkeleton Component
 * Single responsibility: Provide loading placeholder for buttons
 */
export const ButtonSkeleton = React.forwardRef<HTMLDivElement, ButtonSkeletonProps>(
  ({ size = 'md', fullWidth = false, className, ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="rectangular"
        className={cn(
          'rounded-lg',
          !fullWidth && buttonSkeletonSizes[size],
          fullWidth && 'w-full h-10',
          className
        )}
        {...props}
      />
    )
  }
)

ButtonSkeleton.displayName = 'ButtonSkeleton'