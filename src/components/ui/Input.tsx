'use client'

import React from 'react'
import { cn } from '@/utils'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  isLoading?: boolean
  fullWidth?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const inputBaseStyles = [
  // Base layout and typography
  'w-full px-4 py-3 text-base',
  'bg-secondary-surface text-high',
  'border border-border rounded-lg',
  
  // Mobile-first touch optimization
  'min-h-[48px]', // Comfortable touch target
  'touch-manipulation',
  
  // Focus and interaction states
  'transition-all duration-200 ease-in-out',
  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
  'hover:border-accent/60',
  
  // Disabled state
  'disabled:bg-secondary-surface/50 disabled:text-medium disabled:cursor-not-allowed',
  'disabled:border-border/50',
  
  // Placeholder styling
  'placeholder:text-low',
  
  // Remove default appearance on mobile
  'appearance-none',
  
  // Prevent zoom on iOS
  'text-[16px] sm:text-base'
].join(' ')

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    isLoading,
    fullWidth = true,
    id,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const hasError = !!error
    const hasSuccess = !!success && !hasError
    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon || isPassword || isLoading || hasError || hasSuccess

    return (
      <div className={cn('space-y-2', !fullWidth && 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-high"
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-medium">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputBaseStyles,
              
              // Icon padding adjustments
              hasLeftIcon && 'pl-10',
              hasRightIcon && 'pr-10',
              
              // State-specific styles
              hasError && [
                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                'bg-red-50/5'
              ],
              hasSuccess && [
                'border-green-500 focus:border-green-500 focus:ring-green-500/20',
                'bg-green-50/5'
              ],
              isFocused && 'ring-2',
              
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            ref={ref}
            {...props}
          />

          {/* Right icon/actions */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Loading spinner */}
              {isLoading && (
                <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full" />
              )}
              
              {/* Success icon */}
              {hasSuccess && !isLoading && (
                <Check size={16} className="text-green-500" />
              )}
              
              {/* Error icon */}
              {hasError && !isLoading && (
                <AlertCircle size={16} className="text-red-500" />
              )}
              
              {/* Password toggle */}
              {isPassword && !isLoading && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-medium hover:text-high transition-colors p-1 -m-1 touch-manipulation"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
              
              {/* Custom right icon */}
              {rightIcon && !isPassword && !hasError && !hasSuccess && !isLoading && (
                <span className="text-medium">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {/* Help text */}
        {(error || success || hint) && (
          <div className="space-y-1">
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <Check size={14} />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p className="text-sm text-medium">{hint}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    success,
    hint,
    isLoading,
    fullWidth = true,
    resize = 'vertical',
    id,
    rows = 4,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const textareaId = id || React.useId()

    const hasError = !!error
    const hasSuccess = !!success && !hasError

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }

    return (
      <div className={cn('space-y-2', !fullWidth && 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-high"
          >
            {label}
          </label>
        )}

        {/* Textarea container */}
        <div className="relative">
          <textarea
            id={textareaId}
            rows={rows}
            className={cn(
              inputBaseStyles,
              resizeClasses[resize],
              'min-h-[120px]', // Minimum height for textarea
              
              // State-specific styles
              hasError && [
                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                'bg-red-50/5'
              ],
              hasSuccess && [
                'border-green-500 focus:border-green-500 focus:ring-green-500/20',
                'bg-green-50/5'
              ],
              isFocused && 'ring-2',
              
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            ref={ref}
            {...props}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Help text */}
        {(error || success || hint) && (
          <div className="space-y-1">
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <Check size={14} />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p className="text-sm text-medium">{hint}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'