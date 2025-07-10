'use client'

import React from 'react'
import { cn } from '@/utils'
import { Card } from './Card'
import { CardContent } from './CardContent'
import type { PresentationalProps } from '@/patterns'

export interface VideoCardProps extends PresentationalProps {
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

/**
 * VideoCard Component
 * Single responsibility: Display video content with metadata and interactions
 */
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
                    aria-label={isLiked ? 'Unlike video' : 'Like video'}
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