'use client'

import React from 'react'
import { cn } from '@/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  fullWidth?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const cardVariants = {
  default: [
    'bg-secondary-surface border border-border',
    'shadow-sm'
  ].join(' '),
  
  elevated: [
    'bg-secondary-surface border border-border',
    'shadow-lg shadow-black/10'
  ].join(' '),
  
  outlined: [
    'bg-transparent border-2 border-border'
  ].join(' '),
  
  ghost: [
    'bg-transparent border-0'
  ].join(' ')
}

const paddingVariants = {
  none: '',
  sm: 'p-3', // 12px
  md: 'p-4', // 16px
  lg: 'p-6', // 24px
  xl: 'p-8'  // 32px
}

const headerPaddingVariants = {
  none: '',
  sm: 'p-3 pb-0',
  md: 'p-4 pb-0',
  lg: 'p-6 pb-0'
}

const contentPaddingVariants = {
  none: '',
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4'
}

const footerPaddingVariants = {
  none: '',
  sm: 'p-3 pt-0',
  md: 'p-4 pt-0',
  lg: 'p-6 pt-0'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    interactive = false,
    fullWidth = true,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          // Base styles
          'rounded-lg overflow-hidden',
          'transition-all duration-200 ease-in-out',
          
          // Variant styles
          cardVariants[variant],
          
          // Padding
          paddingVariants[padding],
          
          // Interactive states
          interactive && [
            'cursor-pointer touch-manipulation',
            'hover:shadow-md hover:shadow-black/15',
            'hover:border-accent/50',
            'active:scale-[0.99] active:shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
          ],
          
          // Width
          fullWidth ? 'w-full' : 'w-auto',
          
          className
        )}
        tabIndex={interactive ? 0 : undefined}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({
    className,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          'flex flex-col space-y-1.5',
          headerPaddingVariants[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn(
          'font-heading font-semibold text-lg text-high leading-none tracking-tight',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn(
          'text-sm text-medium leading-relaxed',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({
    className,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          contentPaddingVariants[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({
    className,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center',
          footerPaddingVariants[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Specialized card components for common use cases

export interface VideoCardProps extends Omit<CardProps, 'children'> {
  title: string
  creator: string
  thumbnail: string
  duration?: string
  views?: number
  likes?: number
  onPlay?: () => void
  onLike?: () => void
  isLiked?: boolean
}

export const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(
  ({
    title,
    creator,
    thumbnail,
    duration,
    views,
    likes,
    onPlay,
    onLike,
    isLiked = false,
    className,
    ...props
  }, ref) => {
    return (
      <Card
        variant="default"
        padding="none"
        interactive
        className={cn('group overflow-hidden', className)}
        onClick={onPlay}
        ref={ref}
        {...props}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-secondary-surface overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <CardContent padding="md">
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-high line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-medium">
              by {creator}
            </p>
            
            {/* Stats */}
            {(views !== undefined || likes !== undefined) && (
              <div className="flex items-center justify-between text-xs text-low">
                <div className="flex items-center gap-4">
                  {views !== undefined && (
                    <span>{views.toLocaleString()} views</span>
                  )}
                  {likes !== undefined && (
                    <span>{likes.toLocaleString()} likes</span>
                  )}
                </div>
                
                {onLike && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLike()
                    }}
                    className={cn(
                      'p-1 rounded transition-colors touch-manipulation',
                      isLiked ? 'text-red-500' : 'text-low hover:text-high'
                    )}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

VideoCard.displayName = 'VideoCard'