'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface DividerProps extends PresentationalProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  thickness?: 'thin' | 'medium' | 'thick'
  color?: 'border' | 'accent' | 'muted'
}

/**
 * Divider spacing sizes
 */
const dividerSpacing = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6'
}

/**
 * Divider thickness
 */
const dividerThickness = {
  thin: 'border-t',
  medium: 'border-t-2',
  thick: 'border-t-4'
}

/**
 * Divider colors
 */
const dividerColors = {
  border: 'border-border',
  accent: 'border-accent',
  muted: 'border-border/50'
}

/**
 * Divider variants
 */
const dividerVariants = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted'
}

/**
 * Divider Component
 * Single responsibility: Provide visual separation between content sections
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ 
    orientation = 'horizontal',
    variant = 'solid',
    spacing = 'md',
    thickness = 'thin',
    color = 'border',
    className, 
    ...props 
  }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            'border-l h-full',
            dividerVariants[variant],
            dividerColors[color],
            thickness === 'medium' && 'border-l-2',
            thickness === 'thick' && 'border-l-4',
            className
          )}
          {...props}
        />
      )
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'w-full border-0',
          dividerThickness[thickness],
          dividerVariants[variant],
          dividerColors[color],
          dividerSpacing[spacing],
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'