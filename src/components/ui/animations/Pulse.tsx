'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface PulseProps extends PresentationalProps, AnimationProps {
  delay?: number
  duration?: number
  intensity?: number
  triggerOnce?: boolean
}

/**
 * Pulse Animation Component
 * Single responsibility: Handle pulse animations with intersection observer
 */
export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ 
    delay = 0, 
    duration = 1000, 
    intensity = 0.05, 
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
          animation: isVisible 
            ? `pulse-animation ${duration}ms ease-in-out infinite alternate`
            : 'none',
        }}
        {...props}
      >
        {children}
        <style jsx>{`
          @keyframes pulse-animation {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(${1 + intensity});
            }
          }
        `}</style>
      </div>
    )
  }
)

Pulse.displayName = 'Pulse'