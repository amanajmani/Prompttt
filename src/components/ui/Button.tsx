'use client'

import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const buttonVariants = {
  primary: [
    'bg-accent text-white border-accent',
    'hover:bg-accent/90 hover:border-accent/90',
    'active:bg-accent/80 active:scale-[0.98]',
    'disabled:bg-accent/50 disabled:border-accent/50',
    'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
  ].join(' '),
  
  secondary: [
    'bg-secondary-surface text-high border-border',
    'hover:bg-secondary-surface/80 hover:border-border/80',
    'active:bg-secondary-surface/60 active:scale-[0.98]',
    'disabled:bg-secondary-surface/50 disabled:border-border/50 disabled:text-medium',
    'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
  ].join(' '),
  
  outline: [
    'bg-transparent text-high border-border',
    'hover:bg-secondary-surface hover:border-accent',
    'active:bg-secondary-surface/80 active:scale-[0.98]',
    'disabled:bg-transparent disabled:border-border/50 disabled:text-medium',
    'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
  ].join(' '),
  
  ghost: [
    'bg-transparent text-medium border-transparent',
    'hover:bg-secondary-surface hover:text-high',
    'active:bg-secondary-surface/80 active:scale-[0.98]',
    'disabled:bg-transparent disabled:text-low',
    'focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
  ].join(' '),
  
  destructive: [
    'bg-red-600 text-white border-red-600',
    'hover:bg-red-700 hover:border-red-700',
    'active:bg-red-800 active:scale-[0.98]',
    'disabled:bg-red-600/50 disabled:border-red-600/50',
    'focus:ring-2 focus:ring-red-600/20 focus:ring-offset-2 focus:ring-offset-primary-bg'
  ].join(' ')
}

const buttonSizes = {
  sm: [
    'h-8 px-3 text-sm',
    'min-w-[2rem]', // 32px minimum for touch
    'gap-1.5'
  ].join(' '),
  
  md: [
    'h-10 px-4 text-sm',
    'min-w-[2.75rem]', // 44px minimum for touch
    'gap-2'
  ].join(' '),
  
  lg: [
    'h-12 px-6 text-base',
    'min-w-[3rem]', // 48px comfortable touch target
    'gap-2'
  ].join(' '),
  
  xl: [
    'h-14 px-8 text-lg',
    'min-w-[3.5rem]', // 56px large touch target
    'gap-3'
  ].join(' ')
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium rounded-lg border',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-offset-0',
          'select-none touch-manipulation',
          
          // Responsive improvements
          'active:transition-none', // Faster feedback on touch
          'disabled:cursor-not-allowed disabled:pointer-events-none',
          
          // Variant styles
          buttonVariants[variant],
          
          // Size styles
          buttonSizes[size],
          
          // Full width
          fullWidth && 'w-full',
          
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'xl' ? 20 : 16} />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        
        {/* Button text */}
        {isLoading && loadingText ? loadingText : children}
        
        {/* Right icon (hidden when loading) */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Convenience components for common patterns
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="primary" ref={ref} {...props} />
)

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="secondary" ref={ref} {...props} />
)

export const OutlineButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="outline" ref={ref} {...props} />
)

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="ghost" ref={ref} {...props} />
)

PrimaryButton.displayName = 'PrimaryButton'
SecondaryButton.displayName = 'SecondaryButton'
OutlineButton.displayName = 'OutlineButton'
GhostButton.displayName = 'GhostButton'