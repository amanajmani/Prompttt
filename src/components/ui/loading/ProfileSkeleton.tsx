'use client'

import React from 'react'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'
import type { PresentationalProps } from '@/patterns'

export interface ProfileSkeletonProps extends PresentationalProps {}

/**
 * ProfileSkeleton Component
 * Single responsibility: Provide loading placeholder for user profiles
 */
export const ProfileSkeleton = React.forwardRef<HTMLDivElement, ProfileSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Skeleton variant="circular" width="64px" height="64px" />
          
          {/* User info */}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="150px" />
            <Skeleton variant="text" width="100px" />
          </div>
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <Skeleton variant="text" lines={3} />
        </div>
        
        {/* Stats */}
        <div className="flex gap-6">
          <Skeleton variant="text" width="80px" />
          <Skeleton variant="text" width="80px" />
          <Skeleton variant="text" width="80px" />
        </div>
      </div>
    )
  }
)

ProfileSkeleton.displayName = 'ProfileSkeleton'