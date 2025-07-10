'use client'

import React from 'react'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'
import type { PresentationalProps } from '@/patterns'

export interface VideoCardSkeletonProps extends PresentationalProps {}

/**
 * VideoCardSkeleton Component
 * Single responsibility: Provide loading placeholder for video cards
 */
export const VideoCardSkeleton = React.forwardRef<HTMLDivElement, VideoCardSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-secondary-surface rounded-lg overflow-hidden', className)}
        {...props}
      >
        {/* Thumbnail skeleton */}
        <Skeleton variant="rectangular" className="aspect-video w-full" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Skeleton variant="text" lines={2} />
          
          {/* Creator */}
          <Skeleton variant="text" width="60%" />
          
          {/* Stats */}
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="circular" width="24px" height="24px" />
          </div>
        </div>
      </div>
    )
  }
)

VideoCardSkeleton.displayName = 'VideoCardSkeleton'