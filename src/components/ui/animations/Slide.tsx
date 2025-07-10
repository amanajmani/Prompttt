'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface SlideProps extends PresentationalProps, AnimationProps {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  triggerOnce?: boolean
}

/**
 * Slide Animation Component
 * Single responsibility: Handle slide animations with intersection observer
 */
export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ 
    delay = 0, 
    duration = 500, 
    direction = 'up', 
    distance = 50, 
    triggerOnce = true,
    reduceMotion = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)
    const elementRef = React.useRef<HTMLDivElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => elementRef.current!)

    useEffect(() => {
      const element = elementRef.current
      if (!element) return

      // Respect user's motion preferences
      if (reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsVisible(true)
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting && (!triggerOnce || !hasTriggered)) {
            setTimeout(() => {
              setIsVisible(true)
              setHasTriggered(true)
            }, delay)
          } else if (!triggerOnce && entry && !entry.isIntersecting) {
            setIsVisible(false)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(element)

      return () => observer.disconnect()
    }, [delay, triggerOnce, hasTriggered, reduceMotion])

    // Generate transform based on direction
    const getInitialTransform = () => {
      const transforms = {
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`,
        left: `translateX(${distance}px)`,
        right: `translateX(-${distance}px)`,
      }
      
      return transforms[direction]
    }

    const initialTransform = getInitialTransform()

    return (
      <div
        ref={elementRef}
        className={cn(className)}
        style={{
          transform: isVisible ? 'none' : initialTransform,
          opacity: isVisible ? 1 : 0,
          transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Slide.displayName = 'Slide'