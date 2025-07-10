'use client'

import React from 'react'
import { cn, createSizeSystem } from '@/utils'
import type { PresentationalProps, ResponsiveProps } from '@/patterns'

export interface ContainerProps extends PresentationalProps, ResponsiveProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Container sizes using our centralized size system
 */
const containerSizes = createSizeSystem({
  sm: { maxWidth: 'max-w-2xl' },
  md: { maxWidth: 'max-w-4xl' },
  lg: { maxWidth: 'max-w-6xl' },
  xl: { maxWidth: 'max-w-7xl' },
  full: { maxWidth: 'max-w-full' }
})

/**
 * Container padding using our centralized size system
 */
const containerPadding = createSizeSystem({
  none: { padding: '' },
  sm: { padding: 'px-4 sm:px-6' },
  md: { padding: 'px-4 sm:px-6 lg:px-8' },
  lg: { padding: 'px-6 sm:px-8 lg:px-12' }
})

/**
 * Container Component
 * Single responsibility: Provide consistent container layout with responsive sizing
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          containerSizes(size),
          containerPadding(padding),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'