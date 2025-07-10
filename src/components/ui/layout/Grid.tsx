'use client'

import React from 'react'
import { cn, createResponsiveClasses } from '@/utils'
import type { PresentationalProps, ResponsiveValue } from '@/patterns'

export interface GridProps extends PresentationalProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 12>
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rows?: 'auto' | number
  autoFit?: boolean
  minItemWidth?: string
}

/**
 * Grid gap sizes
 */
const gridGaps = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
}

/**
 * Grid column classes
 */
const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
}

/**
 * Grid Component
 * Single responsibility: Provide responsive grid layout system
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    cols = 1, 
    gap = 'md', 
    rows = 'auto', 
    autoFit = false,
    minItemWidth,
    className, 
    children, 
    ...props 
  }, ref) => {
    // Handle responsive columns
    const getColumnClasses = () => {
      if (typeof cols === 'object') {
        return createResponsiveClasses(cols, 'grid-cols-')
      }
      return gridCols[cols]
    }

    // Handle auto-fit grid
    const getGridStyle = () => {
      if (autoFit && minItemWidth) {
        return {
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        }
      }
      return {}
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          getColumnClasses(),
          gridGaps[gap],
          rows !== 'auto' && `grid-rows-${rows}`,
          className
        )}
        style={getGridStyle()}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'