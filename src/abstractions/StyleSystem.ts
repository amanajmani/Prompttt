/**
 * Style System Abstractions
 * Centralized style generation and theme-aware utilities
 * Eliminates code duplication across components
 */

import { cn } from '@/utils'

// =============================================
// VARIANT SYSTEM ABSTRACTION
// =============================================

export type VariantConfig<T extends string> = Record<T, string | string[]>

/**
 * Creates a variant class generator function
 * Eliminates duplicate variant logic across components
 */
export function createVariantSystem<T extends string>(
  baseClasses: string | string[],
  variants: VariantConfig<T>
) {
  return function getVariantClasses(variant: T, additionalClasses?: string): string {
    const base = Array.isArray(baseClasses) ? baseClasses.join(' ') : baseClasses
    const variantClasses = variants[variant]
    const variantString = Array.isArray(variantClasses) ? variantClasses.join(' ') : variantClasses
    
    return cn(base, variantString, additionalClasses)
  }
}

// =============================================
// SIZE SYSTEM ABSTRACTION
// =============================================

export interface SizeConfig {
  padding?: string
  height?: string
  fontSize?: string
  minWidth?: string
  gap?: string
}

export type SizeVariants<T extends string> = Record<T, SizeConfig>

/**
 * Creates a size class generator function
 */
export function createSizeSystem<T extends string>(sizes: SizeVariants<T>) {
  return function getSizeClasses(size: T): string {
    const config = sizes[size]
    const classes: string[] = []
    
    if (config.height) classes.push(config.height)
    if (config.padding) classes.push(config.padding)
    if (config.fontSize) classes.push(config.fontSize)
    if (config.minWidth) classes.push(config.minWidth)
    if (config.gap) classes.push(config.gap)
    
    return classes.join(' ')
  }
}

// =============================================
// RESPONSIVE UTILITIES
// =============================================

export interface ResponsiveConfig<T> {
  mobile: T
  tablet?: T
  desktop?: T
  large?: T
}

/**
 * Generates responsive classes from a config object
 */
export function createResponsiveClasses<T extends string>(
  config: ResponsiveConfig<T>,
  prefix = ''
): string {
  const classes: string[] = []
  
  // Mobile (base)
  classes.push(`${prefix}${config.mobile}`)
  
  // Tablet
  if (config.tablet) {
    classes.push(`md:${prefix}${config.tablet}`)
  }
  
  // Desktop
  if (config.desktop) {
    classes.push(`lg:${prefix}${config.desktop}`)
  }
  
  // Large
  if (config.large) {
    classes.push(`xl:${prefix}${config.large}`)
  }
  
  return classes.join(' ')
}

// =============================================
// THEME-AWARE STYLE GENERATORS
// =============================================

/**
 * Standard button variant system
 * Reusable across all button-like components
 */
export const buttonVariants = createVariantSystem(
  [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg border',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-offset-0',
    'select-none touch-manipulation',
    'active:transition-none',
    'disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    primary: [
      'bg-accent text-white border-accent',
      'hover:bg-accent/90 hover:border-accent/90',
      'active:bg-accent/80 active:scale-[0.98]',
      'disabled:bg-accent/50 disabled:border-accent/50',
      'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
    ],
    secondary: [
      'bg-secondary-surface text-high border-border',
      'hover:bg-secondary-surface/80 hover:border-border/80',
      'active:bg-secondary-surface/60 active:scale-[0.98]',
      'disabled:bg-secondary-surface/50 disabled:border-border/50 disabled:text-medium',
      'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
    ],
    outline: [
      'bg-transparent text-high border-border',
      'hover:bg-secondary-surface hover:border-accent',
      'active:bg-secondary-surface/80 active:scale-[0.98]',
      'disabled:bg-transparent disabled:border-border/50 disabled:text-medium',
      'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
    ],
    ghost: [
      'bg-transparent text-medium border-transparent',
      'hover:bg-secondary-surface hover:text-high',
      'active:bg-secondary-surface/80 active:scale-[0.98]',
      'disabled:bg-transparent disabled:text-low',
      'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
    ],
    destructive: [
      'bg-red-600 text-white border-red-600',
      'hover:bg-red-700 hover:border-red-700',
      'active:bg-red-800 active:scale-[0.98]',
      'disabled:bg-red-600/50 disabled:border-red-600/50',
      'focus:ring-2 focus:ring-red-600/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
    ]
  }
)

/**
 * Standard button sizes
 */
export const buttonSizes = createSizeSystem({
  sm: {
    height: 'h-8',
    padding: 'px-3',
    fontSize: 'text-sm',
    minWidth: 'min-w-[2rem]', // 32px minimum for touch
    gap: 'gap-1.5'
  },
  md: {
    height: 'h-10',
    padding: 'px-4',
    fontSize: 'text-sm',
    minWidth: 'min-w-[2.75rem]', // 44px minimum for touch
    gap: 'gap-2'
  },
  lg: {
    height: 'h-12',
    padding: 'px-6',
    fontSize: 'text-base',
    minWidth: 'min-w-[3rem]', // 48px comfortable touch target
    gap: 'gap-2'
  },
  xl: {
    height: 'h-14',
    padding: 'px-8',
    fontSize: 'text-lg',
    minWidth: 'min-w-[3.5rem]', // 56px large touch target
    gap: 'gap-3'
  }
})

/**
 * Standard input variant system
 */
export const inputVariants = createVariantSystem(
  [
    'w-full rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-low'
  ],
  {
    default: [
      'bg-secondary-surface border-border text-high',
      'hover:border-accent/50',
      'focus:border-accent focus:ring-accent/20',
      'focus:bg-primary-bg'
    ],
    error: [
      'bg-secondary-surface border-red-500 text-high',
      'hover:border-red-600',
      'focus:border-red-500 focus:ring-red-500/20',
      'focus:bg-primary-bg'
    ],
    success: [
      'bg-secondary-surface border-green-500 text-high',
      'hover:border-green-600',
      'focus:border-green-500 focus:ring-green-500/20',
      'focus:bg-primary-bg'
    ]
  }
)

/**
 * Standard card variant system
 */
export const cardVariants = createVariantSystem(
  'rounded-lg transition-all duration-200',
  {
    default: [
      'bg-secondary-surface border border-border',
      'shadow-sm'
    ],
    elevated: [
      'bg-secondary-surface border border-border',
      'shadow-md hover:shadow-lg'
    ],
    outlined: [
      'bg-transparent border-2 border-border',
      'hover:border-accent/50'
    ],
    ghost: [
      'bg-transparent border-transparent',
      'hover:bg-secondary-surface/50'
    ]
  }
)

// =============================================
// ANIMATION UTILITIES
// =============================================

/**
 * Standard animation classes
 */
export const animations = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideIn: 'animate-in slide-in-from-bottom-2 duration-200',
  slideOut: 'animate-out slide-out-to-bottom-2 duration-200',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
} as const

/**
 * Creates animation classes with custom duration
 */
export function createAnimationClasses(
  type: keyof typeof animations,
  duration = 200
): string {
  return animations[type].replace('duration-200', `duration-${duration}`)
}

// =============================================
// FOCUS AND ACCESSIBILITY UTILITIES
// =============================================

/**
 * Standard focus ring styles
 */
export const focusRing = 'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'

/**
 * Touch-friendly target size
 */
export const touchTarget = 'min-h-[44px] min-w-[44px]'

/**
 * Screen reader only styles
 */
export const srOnly = 'sr-only'

/**
 * Creates accessible button/interactive element classes
 */
export function createInteractiveClasses(options: {
  focusable?: boolean
  touchFriendly?: boolean
} = {}): string {
  const classes: string[] = []
  
  if (options.focusable !== false) {
    classes.push(focusRing)
  }
  
  if (options.touchFriendly) {
    classes.push(touchTarget)
  }
  
  return classes.join(' ')
}