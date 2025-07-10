'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface FlexProps extends PresentationalProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: boolean | 'reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  grow?: boolean
  shrink?: boolean
}

/**
 * Flex gap sizes
 */
const flexGaps = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
}

/**
 * Flex direction classes
 */
const flexDirections = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse'
}

/**
 * Flex alignment classes
 */
const flexAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline'
}

const flexJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
}

/**
 * Flex Component
 * Single responsibility: Provide comprehensive flexbox layout control
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    direction = 'row',
    wrap = false,
    align = 'stretch',
    justify = 'start',
    gap = 'none',
    grow = false,
    shrink = true,
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          flexDirections[direction],
          wrap === true && 'flex-wrap',
          wrap === 'reverse' && 'flex-wrap-reverse',
          flexAlign[align],
          flexJustify[justify],
          flexGaps[gap],
          grow && 'flex-grow',
          !shrink && 'flex-shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Flex.displayName = 'Flex'