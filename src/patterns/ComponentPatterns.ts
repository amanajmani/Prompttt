/**
 * Component Patterns and Interfaces
 * Defines standard patterns for component architecture
 */

import { ReactNode } from 'react'

// =============================================
// CONTAINER/PRESENTATIONAL PATTERN INTERFACES
// =============================================

/**
 * Base props for presentational components
 * These components only handle display logic
 */
export interface PresentationalProps {
  className?: string
  children?: ReactNode
  'data-testid'?: string
}

/**
 * Base props for container components
 * These components handle business logic and state
 */
export interface ContainerProps {
  children?: ReactNode
}

/**
 * Props for components that can be controlled or uncontrolled
 */
export interface ControllableProps<T> {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

// =============================================
// VARIANT SYSTEM PATTERN
// =============================================

/**
 * Standard variant system for consistent component APIs
 */
export interface VariantProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Loading state pattern for async components
 */
export interface LoadingProps {
  isLoading?: boolean
  loadingText?: string
  loadingComponent?: ReactNode
}

/**
 * Error state pattern for components that can fail
 */
export interface ErrorProps {
  error?: string | Error | null
  onRetry?: () => void
  errorComponent?: ReactNode
}

// =============================================
// RESPONSIVE PATTERN INTERFACES
// =============================================

/**
 * Responsive value pattern
 * Allows different values for different breakpoints
 */
export interface ResponsiveValue<T> {
  mobile: T
  tablet?: T
  desktop?: T
  large?: T
}

/**
 * Props for responsive components
 */
export interface ResponsiveProps {
  responsive?: boolean
  breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'large'
}

// =============================================
// INTERACTION PATTERN INTERFACES
// =============================================

/**
 * Standard interaction props
 */
export interface InteractionProps {
  disabled?: boolean
  readonly?: boolean
  interactive?: boolean
  focusable?: boolean
}

/**
 * Touch-friendly interaction props
 */
export interface TouchProps {
  touchFriendly?: boolean
  minTouchTarget?: number // Default 44px
}

// =============================================
// COMPOSITION PATTERN INTERFACES
// =============================================

/**
 * Compound component pattern
 * For components that work together as a system
 */
export interface CompoundComponentProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  asChild?: boolean
}

/**
 * Render prop pattern
 */
export interface RenderPropProps<T> {
  children: (props: T) => ReactNode
}

/**
 * Slot pattern for flexible composition
 */
export interface SlotProps {
  slot?: string
  slotProps?: Record<string, any>
}

// =============================================
// FORM PATTERN INTERFACES
// =============================================

/**
 * Standard form field props
 */
export interface FormFieldProps {
  name: string
  label?: string
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Validation pattern
 */
export interface ValidationProps {
  validate?: (value: any) => string | null
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

// =============================================
// ANIMATION PATTERN INTERFACES
// =============================================

/**
 * Animation configuration
 */
export interface AnimationProps {
  animate?: boolean
  duration?: number
  delay?: number
  easing?: string
  reduceMotion?: boolean
}

/**
 * Transition states
 */
export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited'

export interface TransitionProps {
  in?: boolean
  timeout?: number
  onEnter?: () => void
  onEntered?: () => void
  onExit?: () => void
  onExited?: () => void
}

// =============================================
// ACCESSIBILITY PATTERN INTERFACES
// =============================================

/**
 * ARIA props for accessibility
 */
export interface AriaProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
  'aria-checked'?: boolean
  'aria-disabled'?: boolean
  'aria-hidden'?: boolean
  role?: string
}

/**
 * Focus management props
 */
export interface FocusProps {
  autoFocus?: boolean
  tabIndex?: number
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
}

// =============================================
// UTILITY TYPES FOR COMPONENT PATTERNS
// =============================================

/**
 * Extract props from a component type
 */
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

/**
 * Make certain props required
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Polymorphic component props
 */
export type PolymorphicProps<T extends keyof JSX.IntrinsicElements> = {
  as?: T
} & JSX.IntrinsicElements[T]

/**
 * Forward ref component type
 */
export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>