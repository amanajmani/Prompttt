'use client'

import React from 'react'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'
import type { PresentationalProps } from '@/patterns'

export interface TextSkeletonProps extends PresentationalProps {
  lines?: number
  width?: string | number
}

/**
 * TextSkeleton Component
 * Single responsibility: Provide loading placeholder for text content
 */
export const TextSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  ({ lines = 1, width, className, ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="text"
        lines={lines}
        width={width}
        className={className}
        {...props}
      />
    )
  }
)

TextSkeleton.displayName = 'TextSkeleton'