'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface BounceProps extends PresentationalProps, AnimationProps {
  delay?: number
  duration?: number
  intensity?: number
  triggerOnce?: boolean
}

/**
 * Bounce Animation Component
 * Single responsibility: Handle bounce animations with intersection observer
 */
export const Bounce = React.forwardRef<HTMLDivElement, BounceProps>(
  ({ 
    delay = 0, 
    duration = 600, 
    intensity = 0.3, 
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
          transform: isVisible ? 'scale(1)' : `scale(${1 - intensity})`,
          opacity: isVisible ? 1 : 0,
          transition: isVisible 
            ? `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity ${duration}ms ease-out`
            : `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Bounce.displayName = 'Bounce'