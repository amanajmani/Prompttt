'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CardTitleProps extends PresentationalProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Card title sizes
 */
const titleSizes = {
  sm: 'text-sm font-medium',
  md: 'text-lg font-semibold',
  lg: 'text-xl font-semibold'
}

/**
 * CardTitle Component
 * Single responsibility: Provide semantic card title with consistent typography
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', size = 'md', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-heading text-high leading-none tracking-tight',
          titleSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

CardTitle.displayName = 'CardTitle'