'use client'

import React, { useState, useRef } from 'react'
import { Eye, EyeOff, Check, AlertCircle, Upload, X } from 'lucide-react'
import { cn } from '@/utils'

// Form Context for managing form state
interface FormContextType {
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  setFieldError: (name: string, error: string) => void
  setFieldTouched: (name: string, touched: boolean) => void
  clearFieldError: (name: string) => void
}

const FormContext = React.createContext<FormContextType | null>(null)

export const useFormContext = () => {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('Form components must be used within a Form component')
  }
  return context
}

// Form Component
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: FormData) => Promise<void> | void
  children: React.ReactNode
  className?: string
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, children, className, ...props }, ref) => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const setFieldError = (name: string, error: string) => {
      setErrors(prev => ({ ...prev, [name]: error }))
    }

    const setFieldTouched = (name: string, touched: boolean) => {
      setTouched(prev => ({ ...prev, [name]: touched }))
    }

    const clearFieldError = (name: string) => {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)

      try {
        const formData = new FormData(event.currentTarget)
        await onSubmit(formData)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const contextValue: FormContextType = {
      errors,
      touched,
      isSubmitting,
      setFieldError,
      setFieldTouched,
      clearFieldError
    }

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn('space-y-6', className)}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)

Form.displayName = 'Form'

// Form Field Component
export interface FormFieldProps {
  name: string
  label: string
  children: React.ReactElement
  description?: string
  required?: boolean
  className?: string
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, children, description, required, className, ...props }, ref) => {
    const { errors, touched } = useFormContext()
    const error = touched[name] ? errors[name] : undefined

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-high"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {description && (
          <p className="text-xs text-medium">{description}</p>
        )}
        
        {React.cloneElement(children, {
          id: name,
          name: name,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': error ? `${name}-error` : undefined
        })}
        
        {error && (
          <div
            id={`${name}-error`}
            className="flex items-center gap-2 text-sm text-red-500"
            role="alert"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

// Enhanced Input with validation
export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | undefined
  }
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ComponentType<{ size?: number }>
  rightIcon?: React.ComponentType<{ size?: number }>
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    name, 
    validation, 
    size = 'md', 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon,
    className,
    onBlur,
    onChange,
    ...props 
  }, ref) => {
    const { setFieldError, setFieldTouched, clearFieldError } = useFormContext()

    const validateField = (value: string) => {
      if (validation?.required && !value.trim()) {
        return 'This field is required'
      }
      
      if (validation?.minLength && value.length < validation.minLength) {
        return `Must be at least ${validation.minLength} characters`
      }
      
      if (validation?.maxLength && value.length > validation.maxLength) {
        return `Must be no more than ${validation.maxLength} characters`
      }
      
      if (validation?.pattern && !validation.pattern.test(value)) {
        return 'Invalid format'
      }
      
      if (validation?.custom) {
        return validation.custom(value)
      }
      
      return undefined
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const error = validateField(event.target.value)
      setFieldTouched(name, true)
      
      if (error) {
        setFieldError(name, error)
      } else {
        clearFieldError(name)
      }
      
      onBlur?.(event)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Clear error on change if field was previously touched
      const error = validateField(event.target.value)
      if (!error) {
        clearFieldError(name)
      }
      
      onChange?.(event)
    }

    const inputSizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base'
    }

    return (
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium">
            <LeftIcon size={16} />
          </div>
        )}
        
        <input
          ref={ref}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            'w-full border border-border rounded-lg transition-colors',
            'bg-transparent text-high placeholder:text-low',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            inputSizes[size],
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium">
            <RightIcon size={16} />
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

// Password Input with show/hide toggle
export interface FormPasswordProps extends Omit<FormInputProps, 'type'> {
  showToggle?: boolean
}

export const FormPassword = React.forwardRef<HTMLInputElement, FormPasswordProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => setShowPassword(!showPassword)

    return (
      <FormInput
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={showToggle ? undefined : props.rightIcon}
        {...props}
        className={cn(showToggle && 'pr-10', props.className)}
      >
        {showToggle && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium hover:text-high transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </FormInput>
    )
  }
)

FormPassword.displayName = 'FormPassword'

// Textarea with validation
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    custom?: (value: string) => string | undefined
  }
  showCharCount?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    name, 
    validation, 
    showCharCount = false,
    className,
    onBlur,
    onChange,
    maxLength,
    ...props 
  }, ref) => {
    const { setFieldError, setFieldTouched, clearFieldError } = useFormContext()
    const [charCount, setCharCount] = useState(0)

    const validateField = (value: string) => {
      if (validation?.required && !value.trim()) {
        return 'This field is required'
      }
      
      if (validation?.minLength && value.length < validation.minLength) {
        return `Must be at least ${validation.minLength} characters`
      }
      
      if (validation?.maxLength && value.length > validation.maxLength) {
        return `Must be no more than ${validation.maxLength} characters`
      }
      
      if (validation?.custom) {
        return validation.custom(value)
      }
      
      return undefined
    }

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const error = validateField(event.target.value)
      setFieldTouched(name, true)
      
      if (error) {
        setFieldError(name, error)
      } else {
        clearFieldError(name)
      }
      
      onBlur?.(event)
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value
      setCharCount(value.length)
      
      // Clear error on change if field was previously touched
      const error = validateField(value)
      if (!error) {
        clearFieldError(name)
      }
      
      onChange?.(event)
    }

    return (
      <div className="space-y-2">
        <textarea
          ref={ref}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            'w-full min-h-[80px] px-3 py-2 border border-border rounded-lg transition-colors resize-y',
            'bg-transparent text-high placeholder:text-low',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        
        {(showCharCount || maxLength) && (
          <div className="flex justify-end">
            <span className={cn(
              'text-xs',
              maxLength && charCount > maxLength * 0.9 ? 'text-red-500' : 'text-medium'
            )}>
              {charCount}{maxLength && ` / ${maxLength}`}
            </span>
          </div>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

// File Upload Component
export interface FormFileUploadProps {
  name: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onFileSelect?: (files: File[]) => void
  className?: string
}

export const FormFileUpload = React.forwardRef<HTMLInputElement, FormFileUploadProps>(
  ({ 
    name, 
    accept, 
    multiple = false, 
    maxSize,
    onFileSelect,
    className,
    ...props 
  }, ref) => {
    const { setFieldError, clearFieldError } = useFormContext()
    const [dragActive, setDragActive] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    const validateFiles = (files: File[]) => {
      for (const file of files) {
        if (maxSize && file.size > maxSize) {
          return `File "${file.name}" is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`
        }
      }
      return undefined
    }

    const handleFiles = (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const error = validateFiles(fileArray)
      
      if (error) {
        setFieldError(name, error)
        return
      }
      
      clearFieldError(name)
      setSelectedFiles(fileArray)
      onFileSelect?.(fileArray)
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true)
      } else if (e.type === 'dragleave') {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    }

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index)
      setSelectedFiles(newFiles)
      onFileSelect?.(newFiles)
    }

    const openFileDialog = () => {
      inputRef.current?.click()
    }

    return (
      <div className={cn('space-y-4', className)}>
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-accent hover:bg-accent/5',
            dragActive ? 'border-accent bg-accent/10' : 'border-border'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...props}
          />
          
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-medium" />
            <div>
              <p className="text-sm font-medium text-high">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-medium">
                {accept || 'Any file type'}
                {maxSize && ` • Max ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-high">Selected files:</p>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary-surface rounded-lg"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-high truncate">{file.name}</span>
                    <span className="text-xs text-medium flex-shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="p-1 text-medium hover:text-high transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

FormFileUpload.displayName = 'FormFileUpload'

// Submit Button
export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loadingText?: string
  size?: 'sm' | 'md' | 'lg'
}

export const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ children, loadingText = 'Submitting...', size = 'md', className, ...props }, ref) => {
    const { isSubmitting } = useFormContext()

    const buttonSizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    }

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full font-medium rounded-lg transition-colors touch-manipulation',
          'bg-accent text-white hover:bg-accent/90',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {isSubmitting ? loadingText : children}
      </button>
    )
  }
)

FormSubmit.displayName = 'FormSubmit'