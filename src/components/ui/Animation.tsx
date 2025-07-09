'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils'

// Fade In Animation Component
export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  triggerOnce?: boolean
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ 
    delay = 0, 
    duration = 600, 
    direction = 'up', 
    distance = 20, 
    triggerOnce = true,
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
            setTimeout(() => {
              setIsVisible(true)
              setHasTriggered(true)
            }, delay)
          } else if (!triggerOnce && !entry.isIntersecting) {
            setIsVisible(false)
          }
        },
        { threshold: 0.1 }
      )

      const element = ref?.current || document.querySelector(`[data-fade-in]`)
      if (element) {
        observer.observe(element as Element)
      }

      return () => observer.disconnect()
    }, [delay, triggerOnce, hasTriggered, ref])

    const getTransform = () => {
      if (isVisible) return 'translate3d(0, 0, 0)'
      
      switch (direction) {
        case 'up': return `translate3d(0, ${distance}px, 0)`
        case 'down': return `translate3d(0, -${distance}px, 0)`
        case 'left': return `translate3d(${distance}px, 0, 0)`
        case 'right': return `translate3d(-${distance}px, 0, 0)`
        default: return 'translate3d(0, 0, 0)'
      }
    }

    return (
      <div
        ref={ref}
        data-fade-in
        className={cn('transition-all ease-out', className)}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FadeIn.displayName = 'FadeIn'

// Stagger Animation for Lists
export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  staggerDelay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  ({ 
    delay = 0, 
    staggerDelay = 100, 
    duration = 600, 
    direction = 'up', 
    distance = 20,
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay)
          }
        },
        { threshold: 0.1 }
      )

      const element = ref?.current
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }, [delay, ref])

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {React.Children.map(children, (child, index) => (
          <FadeIn
            key={index}
            delay={isVisible ? index * staggerDelay : 0}
            duration={duration}
            direction={direction}
            distance={distance}
            triggerOnce={true}
          >
            {child}
          </FadeIn>
        ))}
      </div>
    )
  }
)

Stagger.displayName = 'Stagger'

// Scale Animation Component
export interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number
  duration?: number
  trigger?: 'hover' | 'focus' | 'active' | 'visible'
  transformOrigin?: string
}

export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ 
    scale = 1.05, 
    duration = 200, 
    trigger = 'hover', 
    transformOrigin = 'center',
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isTriggered, setIsTriggered] = useState(false)

    const handleMouseEnter = () => {
      if (trigger === 'hover') setIsTriggered(true)
    }

    const handleMouseLeave = () => {
      if (trigger === 'hover') setIsTriggered(false)
    }

    const handleFocus = () => {
      if (trigger === 'focus') setIsTriggered(true)
    }

    const handleBlur = () => {
      if (trigger === 'focus') setIsTriggered(false)
    }

    const handleMouseDown = () => {
      if (trigger === 'active') setIsTriggered(true)
    }

    const handleMouseUp = () => {
      if (trigger === 'active') setIsTriggered(false)
    }

    useEffect(() => {
      if (trigger === 'visible') {
        const observer = new IntersectionObserver(
          ([entry]) => setIsTriggered(entry.isIntersecting),
          { threshold: 0.1 }
        )

        const element = ref?.current
        if (element) {
          observer.observe(element)
        }

        return () => observer.disconnect()
      }
    }, [trigger, ref])

    return (
      <div
        ref={ref}
        className={cn('transition-transform ease-out', className)}
        style={{
          transform: isTriggered ? `scale(${scale})` : 'scale(1)',
          transformOrigin,
          transitionDuration: `${duration}ms`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Scale.displayName = 'Scale'

// Slide Animation Component
export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: 'left' | 'right' | 'up' | 'down'
  distance?: number
  duration?: number
  delay?: number
  triggerOnce?: boolean
}

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ 
    direction, 
    distance = 100, 
    duration = 600, 
    delay = 0, 
    triggerOnce = true,
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay)
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        },
        { threshold: 0.1 }
      )

      const element = ref?.current
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }, [delay, triggerOnce, ref])

    const getTransform = () => {
      if (isVisible) return 'translate3d(0, 0, 0)'
      
      switch (direction) {
        case 'left': return `translate3d(-${distance}px, 0, 0)`
        case 'right': return `translate3d(${distance}px, 0, 0)`
        case 'up': return `translate3d(0, -${distance}px, 0)`
        case 'down': return `translate3d(0, ${distance}px, 0)`
        default: return 'translate3d(0, 0, 0)'
      }
    }

    return (
      <div
        ref={ref}
        className={cn('transition-all ease-out', className)}
        style={{
          transform: getTransform(),
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Slide.displayName = 'Slide'

// Bounce Animation Component
export interface BounceProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  delay?: number
  repeat?: boolean
  intensity?: 'subtle' | 'normal' | 'strong'
}

export const Bounce = React.forwardRef<HTMLDivElement, BounceProps>(
  ({ 
    duration = 1000, 
    delay = 0, 
    repeat = false, 
    intensity = 'normal',
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsAnimating(true), delay)
          }
        },
        { threshold: 0.1 }
      )

      const element = ref?.current
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }, [delay, ref])

    const getBounceKeyframes = () => {
      const scale = intensity === 'subtle' ? 1.02 : intensity === 'strong' ? 1.1 : 1.05
      return {
        '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
        '40%, 43%': { transform: `translate3d(0, -${intensity === 'subtle' ? 5 : intensity === 'strong' ? 20 : 10}px, 0) scale(${scale})` },
        '70%': { transform: `translate3d(0, -${intensity === 'subtle' ? 2 : intensity === 'strong' ? 8 : 4}px, 0)` },
        '90%': { transform: 'translate3d(0, -2px, 0)' }
      }
    }

    return (
      <div
        ref={ref}
        className={cn('transition-all ease-out', className)}
        style={{
          animation: isAnimating 
            ? `bounce-custom ${duration}ms ${repeat ? 'infinite' : 'once'} ease-out`
            : 'none',
        }}
        {...props}
      >
        {children}
        <style jsx>{`
          @keyframes bounce-custom {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
            40%, 43% { transform: translate3d(0, -${intensity === 'subtle' ? 5 : intensity === 'strong' ? 20 : 10}px, 0) scale(${intensity === 'subtle' ? 1.02 : intensity === 'strong' ? 1.1 : 1.05}); }
            70% { transform: translate3d(0, -${intensity === 'subtle' ? 2 : intensity === 'strong' ? 8 : 4}px, 0); }
            90% { transform: translate3d(0, -2px, 0); }
          }
        `}</style>
      </div>
    )
  }
)

Bounce.displayName = 'Bounce'

// Pulse Animation Component
export interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  intensity?: 'subtle' | 'normal' | 'strong'
  repeat?: boolean
  color?: string
}

export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ 
    duration = 2000, 
    intensity = 'normal', 
    repeat = true, 
    color = 'rgba(0, 169, 255, 0.3)',
    className, 
    children, 
    ...props 
  }, ref) => {
    const getScale = () => {
      switch (intensity) {
        case 'subtle': return 1.02
        case 'strong': return 1.1
        default: return 1.05
      }
    }

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {children}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            animation: `pulse-custom ${duration}ms ${repeat ? 'infinite' : 'once'} ease-in-out`,
            backgroundColor: color,
          }}
        />
        <style jsx>{`
          @keyframes pulse-custom {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0; 
            }
            50% { 
              transform: scale(${getScale()}); 
              opacity: 1; 
            }
          }
        `}</style>
      </div>
    )
  }
)

Pulse.displayName = 'Pulse'

// Page Transition Component
export interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

PageTransition.displayName = 'PageTransition'

// Reveal Animation (for text/content)
export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  duration?: number
  stagger?: boolean
  staggerDelay?: number
}

export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ 
    delay = 0, 
    duration = 800, 
    stagger = false, 
    staggerDelay = 100,
    className, 
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay)
          }
        },
        { threshold: 0.1 }
      )

      const element = ref?.current
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }, [delay, ref])

    if (stagger) {
      return (
        <div ref={ref} className={className} {...props}>
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="overflow-hidden"
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                opacity: isVisible ? 1 : 0,
                transition: `all ${duration}ms ease-out ${index * staggerDelay}ms`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden', className)}
        {...props}
      >
        <div
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: `transform ${duration}ms ease-out`,
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

Reveal.displayName = 'Reveal'