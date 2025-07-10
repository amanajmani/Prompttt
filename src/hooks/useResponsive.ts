'use client'

import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/constants'

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLarge: boolean
  currentBreakpoint: Breakpoint
  width: number
}

/**
 * Custom hook for responsive design logic
 * Centralizes all responsive behavior and breakpoint management
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: true, // Default to mobile-first
    isTablet: false,
    isDesktop: false,
    isLarge: false,
    currentBreakpoint: 'mobile',
    width: 320, // Default mobile width
  })

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth
      
      const isMobile = width < BREAKPOINTS.MD
      const isTablet = width >= BREAKPOINTS.MD && width < BREAKPOINTS.LG
      const isDesktop = width >= BREAKPOINTS.LG && width < BREAKPOINTS.XL
      const isLarge = width >= BREAKPOINTS.XL

      let currentBreakpoint: Breakpoint = 'mobile'
      if (isLarge) currentBreakpoint = 'large'
      else if (isDesktop) currentBreakpoint = 'desktop'
      else if (isTablet) currentBreakpoint = 'tablet'

      setState({
        isMobile,
        isTablet,
        isDesktop,
        isLarge,
        currentBreakpoint,
        width,
      })
    }

    // Set initial state
    updateResponsiveState()

    // Add event listener
    window.addEventListener('resize', updateResponsiveState)

    // Cleanup
    return () => window.removeEventListener('resize', updateResponsiveState)
  }, [])

  return state
}

/**
 * Hook for responsive values based on current breakpoint
 */
export function useResponsiveValue<T>(values: {
  mobile: T
  tablet?: T
  desktop?: T
  large?: T
}): T {
  const { currentBreakpoint } = useResponsive()

  switch (currentBreakpoint) {
    case 'large':
      return values.large ?? values.desktop ?? values.tablet ?? values.mobile
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile
    case 'tablet':
      return values.tablet ?? values.mobile
    case 'mobile':
    default:
      return values.mobile
  }
}

/**
 * Hook for touch device detection
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - Legacy property
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouchDevice()
  }, [])

  return isTouchDevice
}