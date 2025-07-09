'use client'

import React from 'react'
import { cn } from '@/utils'

// Container Component
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
}

const containerPadding = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          containerSizes[size],
          containerPadding[padding],
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

// Grid Component
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
}

const responsiveGridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  12: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12'
}

const gridGaps = {
  none: 'gap-0',
  sm: 'gap-2 sm:gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-12'
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 'md', responsive = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsive ? responsiveGridCols[cols] : gridCols[cols],
          gridGaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

// Stack Component (Vertical Layout)
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  responsive?: boolean
}

const stackSpacing = {
  none: 'space-y-0',
  xs: 'space-y-1 sm:space-y-2',
  sm: 'space-y-2 sm:space-y-3',
  md: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8',
  xl: 'space-y-8 sm:space-y-12'
}

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ spacing = 'md', align = 'stretch', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          stackSpacing[spacing],
          stackAlign[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

// Flex Component (Horizontal Layout)
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: boolean
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const flexDirection = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse'
}

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

const flexGaps = {
  none: 'gap-0',
  xs: 'gap-1 sm:gap-2',
  sm: 'gap-2 sm:gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-12'
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    direction = 'row', 
    wrap = false, 
    align = 'center', 
    justify = 'start', 
    gap = 'md',
    responsive = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          flexDirection[direction],
          wrap && 'flex-wrap',
          flexAlign[align],
          flexJustify[justify],
          flexGaps[gap],
          responsive && 'flex-col sm:flex-row',
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

// Section Component
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'primary' | 'secondary' | 'transparent'
}

const sectionPadding = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20',
  xl: 'py-20 sm:py-24'
}

const sectionBackground = {
  primary: 'bg-primary-bg',
  secondary: 'bg-secondary-surface',
  transparent: 'bg-transparent'
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ padding = 'md', background = 'transparent', className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          sectionPadding[padding],
          sectionBackground[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

// Divider Component
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'dashed' | 'dotted'
}

const dividerSpacing = {
  none: '',
  sm: 'my-4',
  md: 'my-6 sm:my-8',
  lg: 'my-8 sm:my-12'
}

const dividerVariant = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted'
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', spacing = 'md', variant = 'solid', className, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          className={cn(
            'border-l border-border h-full',
            dividerVariant[variant],
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
          'border-t border-border w-full',
          dividerVariant[variant],
          dividerSpacing[spacing],
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

// Aspect Ratio Component
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number | string
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16/9, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{ aspectRatio: ratio }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AspectRatio.displayName = 'AspectRatio'

// Center Component
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: 'both' | 'horizontal' | 'vertical'
  minHeight?: string
}

const centerAxis = {
  both: 'flex items-center justify-center',
  horizontal: 'flex justify-center',
  vertical: 'flex items-center'
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ axis = 'both', minHeight, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          centerAxis[axis],
          className
        )}
        style={{ minHeight }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Center.displayName = 'Center'

// Masonry Grid Component (for video galleries)
export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5
  gap?: 'sm' | 'md' | 'lg'
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 'md', className, children, ...props }, ref) => {
    const gapClass = gap === 'sm' ? 'gap-2' : gap === 'lg' ? 'gap-6' : 'gap-4'
    
    return (
      <div
        ref={ref}
        className={cn(
          'columns-1 sm:columns-2',
          columns >= 3 && 'lg:columns-3',
          columns >= 4 && 'xl:columns-4',
          columns >= 5 && '2xl:columns-5',
          gapClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Masonry.displayName = 'Masonry'