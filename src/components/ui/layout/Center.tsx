'use client'

import React from 'react'
import { cn } from '@/utils'
import type { PresentationalProps } from '@/patterns'

export interface CenterProps extends PresentationalProps {
  axis?: 'both' | 'horizontal' | 'vertical'
  inline?: boolean
}

/**
 * Center axis configurations
 */
const centerAxis = {
  both: 'flex items-center justify-center',
  horizontal: 'flex justify-center',
  vertical: 'flex items-center'
}

/**
 * Center Component
 * Single responsibility: Center content along specified axes
 */
export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ axis = 'both', inline = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          centerAxis[axis],
          inline ? 'inline-flex' : 'flex',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Center.displayName = 'Center'