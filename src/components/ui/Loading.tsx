'use client'

import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  return (
    <Loader2
      className={cn(
        'animate-spin text-accent',
        spinnerSizes[size],
        className
      )}
    />
  )
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  className,
  style,
  ...props
}) => {
  const baseStyles = [
    'bg-secondary-surface/60 animate-pulse rounded',
    'relative overflow-hidden'
  ].join(' ')

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  }

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseStyles,
              variantStyles.text,
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height: height || '1rem',
              ...style
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? width : '2rem'),
        ...style
      }}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  fallback,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || <LoadingSpinner size="lg" />}
      </div>
    )
  }

  return <>{children}</>
}

// Specialized loading components for common use cases

export const VideoCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Thumbnail skeleton */}
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      
      {/* Content skeleton */}
      <div className="space-y-2 p-4">
        {/* Title (2 lines) */}
        <Skeleton variant="text" lines={2} />
        
        {/* Creator */}
        <Skeleton variant="text" width="60%" />
        
        {/* Stats */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" width="40%" height="0.75rem" />
          <Skeleton variant="circular" width="1rem" height="1rem" />
        </div>
      </div>
    </div>
  )
}

export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Avatar */}
      <Skeleton variant="circular" width="3rem" height="3rem" />
      
      {/* Info */}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" height="0.75rem" />
      </div>
    </div>
  )
}

export const ButtonSkeleton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  className?: string 
}> = ({ 
  size = 'md', 
  fullWidth = false,
  className 
}) => {
  const sizeStyles = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14'
  }

  return (
    <Skeleton
      variant="rectangular"
      className={cn(
        sizeStyles[size],
        fullWidth ? 'w-full' : 'w-24',
        className
      )}
    />
  )
}

export const TextSkeleton: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  )
}

// Loading grid for video galleries
export const VideoGridSkeleton: React.FC<{
  count?: number
  columns?: 1 | 2 | 3 | 4
  className?: string
}> = ({ 
  count = 8, 
  columns = 3,
  className 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-6',
      gridCols[columns],
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Page loading component
export const PageLoading: React.FC<{
  message?: string
  className?: string
}> = ({ 
  message = 'Loading...', 
  className 
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[400px] space-y-4',
      className
    )}>
      <LoadingSpinner size="xl" />
      <p className="text-medium font-medium">{message}</p>
    </div>
  )
}

// Add shimmer animation to global CSS
export const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`