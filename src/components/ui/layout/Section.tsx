'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface SectionProps extends PresentationalProps {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'transparent' | 'primary' | 'secondary'
  fullWidth?: boolean
  as?: keyof JSX.IntrinsicElements
}

/**
 * Section spacing sizes
 */
const sectionSpacing = {
  none: 'py-0',
  sm: 'py-4 sm:py-6',
  md: 'py-8 sm:py-12',
  lg: 'py-12 sm:py-16',
  xl: 'py-16 sm:py-20'
}

/**
 * Section background variants
 */
const sectionBackgrounds = {
  transparent: 'bg-transparent',
  primary: 'bg-primary-bg',
  secondary: 'bg-secondary-surface'
}

/**
 * Section Component
 * Single responsibility: Provide semantic section layout with consistent spacing
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    spacing = 'md',
    background = 'transparent',
    fullWidth = false,
    as: Component = 'section',
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          sectionSpacing[spacing],
          sectionBackgrounds[background],
          !fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Section.displayName = 'Section'