'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface ScaleProps extends PresentationalProps, AnimationProps {
  delay?: number
  duration?: number
  from?: number
  to?: number
  triggerOnce?: boolean
}

/**
 * Scale Animation Component
 * Single responsibility: Handle scale animations with intersection observer
 */
export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ 
    delay = 0, 
    duration = 400, 
    from = 0.8, 
    to = 1, 
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

    return (
      <div
        ref={elementRef}
        className={cn(className)}
        style={{
          transform: `scale(${isVisible ? to : from})`,
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

Scale.displayName = 'Scale'