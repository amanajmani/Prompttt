'use client'

import { useState, useCallback, useRef } from 'react'

export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
  message?: string
}

export interface FieldConfig {
  rules?: ValidationRule
  initialValue?: any
}

export interface FormConfig {
  [fieldName: string]: FieldConfig
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

export interface FormActions {
  setValue: (field: string, value: any) => void
  setError: (field: string, error: string) => void
  clearError: (field: string) => void
  setTouched: (field: string, touched?: boolean) => void
  validateField: (field: string) => boolean
  validateForm: () => boolean
  reset: () => void
  handleSubmit: (onSubmit: (values: Record<string, any>) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>
}

/**
 * Comprehensive form management hook
 * Handles validation, state management, and submission logic
 * Follows React best practices for form handling
 */
export function useForm(config: FormConfig = {}): FormState & FormActions {
  const configRef = useRef(config)
  configRef.current = config

  // Initialize form state
  const [state, setState] = useState<FormState>(() => {
    const initialValues: Record<string, any> = {}
    Object.entries(config).forEach(([field, fieldConfig]) => {
      initialValues[field] = fieldConfig.initialValue ?? ''
    })

    return {
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    }
  })

  // Validate a single field
  const validateField = useCallback((field: string): boolean => {
    const value = state.values[field]
    const rules = configRef.current[field]?.rules

    if (!rules) return true

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: rules.message || `${field} is required` }
      }))
      return false
    }

    // String validations
    if (typeof value === 'string') {
      // Min length
      if (rules.minLength && value.length < rules.minLength) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: rules.message || `${field} must be at least ${rules.minLength} characters` }
        }))
        return false
      }

      // Max length
      if (rules.maxLength && value.length > rules.maxLength) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: rules.message || `${field} must be no more than ${rules.maxLength} characters` }
        }))
        return false
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: rules.message || `${field} format is invalid` }
        }))
        return false
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: customError }
        }))
        return false
      }
    }

    // Clear error if validation passes
    setState(prev => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return {
        ...prev,
        errors: newErrors
      }
    })

    return true
  }, [state.values])

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const fields = Object.keys(configRef.current)
    let isFormValid = true

    fields.forEach(field => {
      const isFieldValid = validateField(field)
      if (!isFieldValid) {
        isFormValid = false
      }
    })

    setState(prev => ({ ...prev, isValid: isFormValid }))
    return isFormValid
  }, [validateField])

  // Set field value
  const setValue = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value }
    }))
  }, [])

  // Set field error
  const setError = useCallback((field: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error }
    }))
  }, [])

  // Clear field error
  const clearError = useCallback((field: string) => {
    setState(prev => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return { ...prev, errors: newErrors }
    })
  }, [])

  // Set field touched
  const setTouched = useCallback((field: string, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched }
    }))
  }, [])

  // Reset form
  const reset = useCallback(() => {
    const initialValues: Record<string, any> = {}
    Object.entries(configRef.current).forEach(([field, fieldConfig]) => {
      initialValues[field] = fieldConfig.initialValue ?? ''
    })

    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    })
  }, [])

  // Handle form submission
  const handleSubmit = useCallback((
    onSubmit: (values: Record<string, any>) => Promise<void> | void
  ) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setState(prev => ({ ...prev, isSubmitting: true }))

      try {
        const isValid = validateForm()
        if (!isValid) {
          return
        }

        await onSubmit(state.values)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }))
      }
    }
  }, [state.values, validateForm])

  return {
    // State
    ...state,
    // Actions
    setValue,
    setError,
    clearError,
    setTouched,
    validateField,
    validateForm,
    reset,
    handleSubmit,
  }
}