'use client'

import React from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface PageTransitionProps extends PresentationalProps, AnimationProps {
  type?: 'fade' | 'slide' | 'scale'
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
}

/**
 * PageTransition Animation Component
 * Single responsibility: Handle page-level transitions
 */
export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ 
    type = 'fade',
    direction = 'up',
    duration = 300,
    reduceMotion = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    // Respect user's motion preferences
    if (reduceMotion || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      )
    }

    const getTransitionClasses = () => {
      const baseClasses = `transition-all duration-${duration} ease-out`
      
      switch (type) {
        case 'slide':
          return cn(
            baseClasses,
            'animate-in',
            direction === 'up' && 'slide-in-from-bottom-4',
            direction === 'down' && 'slide-in-from-top-4',
            direction === 'left' && 'slide-in-from-right-4',
            direction === 'right' && 'slide-in-from-left-4'
          )
        case 'scale':
          return cn(baseClasses, 'animate-in zoom-in-95')
        case 'fade':
        default:
          return cn(baseClasses, 'animate-in fade-in')
      }
    }

    return (
      <div
        ref={ref}
        className={cn(getTransitionClasses(), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PageTransition.displayName = 'PageTransition'