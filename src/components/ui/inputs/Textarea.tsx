'use client'

import React from 'react'
import { cn, inputVariants } from '@/utils'
import { AlertCircle, Check } from 'lucide-react'
import type { PresentationalProps, FormFieldProps } from '@/patterns'

export interface TextareaProps extends 
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  PresentationalProps,
  FormFieldProps {
  variant?: 'default' | 'error' | 'success'
  isLoading?: boolean
  fullWidth?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  minRows?: number
  maxRows?: number
  hint?: string // Keep backward compatibility
}

/**
 * Resize configurations
 */
const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

/**
 * Textarea Component
 * Single responsibility: Provide multi-line text input with validation states
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    variant = 'default',
    label,
    error,
    success,
    description,
    hint, // Keep backward compatibility
    isLoading = false,
    fullWidth = true,
    resize = 'vertical',
    minRows = 3,
    maxRows,
    required = false,
    disabled = false,
    id,
    className,
    ...props
  }, ref) => {
    const textareaId = React.useId()
    const finalId = id || textareaId

    // Determine variant based on validation state
    const currentVariant = error ? 'error' : success ? 'success' : variant

    // Show validation icon
    const showValidationIcon = error || success
    const validationIcon = error ? <AlertCircle size={16} /> : <Check size={16} />

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label htmlFor={finalId} className="block text-sm font-medium text-high">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={ref}
            id={finalId}
            disabled={disabled || isLoading}
            required={required}
            rows={minRows}
            style={{
              maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined
            }}
            className={cn(
              inputVariants(currentVariant),
              'py-3 px-4 min-h-[80px]',
              resizeClasses[resize],
              showValidationIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Validation Icon */}
          {showValidationIcon && (
            <div className={cn(
              'absolute top-3 right-3',
              error ? 'text-red-500' : 'text-green-500'
            )}>
              {validationIcon}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute top-3 right-3">
              <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          )}
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

Textarea.displayName = 'Textarea'