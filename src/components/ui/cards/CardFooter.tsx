'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CardFooterProps extends PresentationalProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  justify?: 'start' | 'center' | 'end' | 'between'
}

/**
 * Card footer padding sizes
 */
const footerPadding = {
  none: 'p-0',
  sm: 'p-3 pt-0',
  md: 'p-4 pt-0',
  lg: 'p-6 pt-0'
}

/**
 * Footer justification
 */
const footerJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between'
}

/**
 * CardFooter Component
 * Single responsibility: Provide card footer with action alignment
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ padding = 'md', justify = 'start', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          footerPadding[padding],
          footerJustify[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'