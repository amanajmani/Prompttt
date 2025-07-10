'use client'

import React from 'react'
import { cn } from '@/utils'
import { VideoCardSkeleton } from './VideoCardSkeleton'
import type { PresentationalProps } from '@/patterns'

export interface VideoGridSkeletonProps extends PresentationalProps {
  count?: number
  columns?: 1 | 2 | 3 | 4
}

/**
 * Grid column classes
 */
const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

/**
 * VideoGridSkeleton Component
 * Single responsibility: Provide loading placeholder for video grids
 */
export const VideoGridSkeleton = React.forwardRef<HTMLDivElement, VideoGridSkeletonProps>(
  ({ count = 6, columns = 3, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-6',
          gridColumns[columns],
          className
        )}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }
)

VideoGridSkeleton.displayName = 'VideoGridSkeleton'