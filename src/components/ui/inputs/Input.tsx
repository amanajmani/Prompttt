'use client'

import React, { useState } from 'react'
import { cn, inputVariants } from '@/utils'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import type { PresentationalProps, FormFieldProps } from '@/patterns'

export interface InputProps extends 
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  PresentationalProps,
  FormFieldProps {
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  hint?: string // Keep backward compatibility
}

/**
 * Input size configurations
 */
const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm', 
  lg: 'h-12 px-4 text-base'
}

/**
 * Input Component
 * Single responsibility: Provide text input with validation states and icons
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'default',
    size = 'md',
    label,
    error,
    success,
    description,
    hint, // Keep backward compatibility
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = true,
    required = false,
    disabled = false,
    type = 'text',
    id,
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const inputId = React.useId()
    const finalId = id || inputId

    // Determine actual input type for password toggle
    const inputType = type === 'password' && showPassword ? 'text' : type
    
    // Determine variant based on validation state
    const currentVariant = error ? 'error' : success ? 'success' : variant

    // Show validation icon
    const showValidationIcon = (error || success) && !rightIcon && !isLoading
    const validationIcon = error ? <AlertCircle size={16} /> : <Check size={16} />

    // Show password toggle for password inputs
    const showPasswordToggle = type === 'password'
    const passwordToggleIcon = showPassword ? <EyeOff size={16} /> : <Eye size={16} />

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label htmlFor={finalId} className="block text-sm font-medium text-high">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-medium pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={finalId}
            type={inputType}
            disabled={disabled || isLoading}
            required={required}
            className={cn(
              inputVariants(currentVariant),
              inputSizes[size],
              leftIcon && 'pl-10',
              (rightIcon || showValidationIcon || showPasswordToggle) && 'pr-10',
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
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading Spinner */}
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full" />
            )}

            {/* Validation Icon */}
            {showValidationIcon && (
              <div className={cn(
                error ? 'text-red-500' : 'text-green-500'
              )}>
                {validationIcon}
              </div>
            )}

            {/* Password Toggle */}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-medium hover:text-high transition-colors touch-manipulation"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {passwordToggleIcon}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !showValidationIcon && !isLoading && (
              <div className="text-medium">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {(description || hint || error || success) && (
          <div className="text-xs">
            {error && <p className="text-red-500">{error}</p>}
            {success && !error && <p className="text-green-500">{success}</p>}
            {(description || hint) && !error && !success && <p className="text-medium">{description || hint}</p>}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'