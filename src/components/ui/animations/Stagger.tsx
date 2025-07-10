'use client'

import React, { useState, useEffect, Children, cloneElement, isValidElement } from 'react'
import { cn } from '@/utils'
import type { AnimationProps, PresentationalProps } from '@/patterns'

export interface StaggerProps extends PresentationalProps, AnimationProps {
  delay?: number
  staggerDelay?: number
  duration?: number
  triggerOnce?: boolean
}

/**
 * Stagger Animation Component
 * Single responsibility: Handle staggered animations for child elements
 */
export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  ({ 
    delay = 0, 
    staggerDelay = 100, 
    duration = 400,
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

    // Clone children with staggered animation delays
    const animatedChildren = Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child

      const childDelay = isVisible ? index * staggerDelay : 0

      return cloneElement(child, {
        ...child.props,
        style: {
          ...child.props.style,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity ${duration}ms ease-out ${childDelay}ms, transform ${duration}ms ease-out ${childDelay}ms`,
        },
      })
    })

    return (
      <div
        ref={elementRef}
        className={cn(className)}
        {...props}
      >
        {animatedChildren}
      </div>
    )
  }
)

Stagger.displayName = 'Stagger'