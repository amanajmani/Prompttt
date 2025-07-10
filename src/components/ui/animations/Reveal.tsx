'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface RevealProps extends PresentationalProps, AnimationProps {
  delay?: number
  duration?: number
  direction?: 'horizontal' | 'vertical'
  triggerOnce?: boolean
}

/**
 * Reveal Animation Component
 * Single responsibility: Handle reveal animations with mask effect
 */
export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ 
    delay = 0, 
    duration = 800, 
    direction = 'horizontal',
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

    const maskDirection = direction === 'horizontal' 
      ? 'inset(0 0 0 0)' 
      : 'inset(0 0 0 0)'
    
    const initialMask = direction === 'horizontal'
      ? 'inset(0 100% 0 0)'
      : 'inset(100% 0 0 0)'

    return (
      <div
        ref={elementRef}
        className={cn('overflow-hidden', className)}
        style={{
          clipPath: isVisible ? maskDirection : initialMask,
          transition: `clip-path ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Reveal.displayName = 'Reveal'