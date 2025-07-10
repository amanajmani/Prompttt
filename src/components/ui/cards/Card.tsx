'use client'

import React from 'react'
import { cn, cardVariants } from '@/utils'
import type { PresentationalProps, VariantProps, InteractionProps } from '@/patterns'

export interface CardProps extends PresentationalProps, VariantProps, InteractionProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  as?: keyof JSX.IntrinsicElements
}

/**
 * Card padding sizes using our centralized system
 */
const cardPadding = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
}

/**
 * Card Component
 * Single responsibility: Provide base card container with variants
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default',
    padding = 'md',
    interactive = false,
    fullWidth = false,
    as: Component = 'div',
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          cardVariants(variant),
          cardPadding[padding],
          interactive && 'cursor-pointer hover:shadow-md transition-shadow',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'