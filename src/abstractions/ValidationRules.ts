/**
 * Validation Rules Abstraction
 * Centralized validation logic to eliminate duplication
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// =============================================
// BASIC VALIDATION FUNCTIONS
// =============================================

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  return { isValid: true }
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }
  
  return { isValid: true }
}

/**
 * Username validation
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' }
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be no more than 20 characters long' }
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' }
  }
  
  return { isValid: true }
}

/**
 * URL validation
 */
export function validateUrl(url: string, required = false): ValidationResult {
  if (!url) {
    if (required) {
      return { isValid: false, error: 'URL is required' }
    }
    return { isValid: true }
  }
  
  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  options: { min?: number; max?: number; fieldName?: string }
): ValidationResult {
  const { min, max, fieldName = 'Field' } = options
  
  if (min !== undefined && value.length < min) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${min} character${min === 1 ? '' : 's'} long` 
    }
  }
  
  if (max !== undefined && value.length > max) {
    return { 
      isValid: false, 
      error: `${fieldName} must be no more than ${max} character${max === 1 ? '' : 's'} long` 
    }
  }
  
  return { isValid: true }
}

/**
 * File validation
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    required?: boolean
  } = {}
): ValidationResult {
  const { maxSize, allowedTypes, required = false } = options
  
  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' }
    }
    return { isValid: true }
  }
  
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` }
  }
  
  if (allowedTypes && allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return { 
        isValid: false, 
        error: `File type must be one of: ${allowedTypes.join(', ')}` 
      }
    }
  }
  
  return { isValid: true }
}

// =============================================
// COMPOSITE VALIDATION FUNCTIONS
// =============================================

/**
 * Validate multiple rules and return first error
 */
export function validateMultiple(
  value: any,
  validators: Array<(value: any) => ValidationResult>
): ValidationResult {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.isValid) {
      return result
    }
  }
  
  return { isValid: true }
}

/**
 * Validate form data against schema
 */
export function validateFormData<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, Array<(value: any) => ValidationResult>>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {}
  let isValid = true
  
  for (const [field, validators] of Object.entries(schema)) {
    const value = data[field as keyof T]
    const result = validateMultiple(value, validators)
    
    if (!result.isValid) {
      errors[field as keyof T] = result.error
      isValid = false
    }
  }
  
  return { isValid, errors }
}

// =============================================
// VALIDATION RULE BUILDERS
// =============================================

/**
 * Creates a required validator with custom message
 */
export function required(fieldName?: string) {
  return (value: any) => validateRequired(value, fieldName)
}

/**
 * Creates a length validator
 */
export function length(min?: number, max?: number, fieldName?: string) {
  return (value: string) => validateLength(value, { min, max, fieldName })
}

/**
 * Creates a pattern validator
 */
export function pattern(regex: RegExp, message: string) {
  return (value: string): ValidationResult => {
    if (!value) return { isValid: true } // Let required handle empty values
    
    if (!regex.test(value)) {
      return { isValid: false, error: message }
    }
    
    return { isValid: true }
  }
}

/**
 * Creates a custom validator
 */
export function custom<T>(
  validator: (value: T) => boolean,
  message: string
) {
  return (value: T): ValidationResult => {
    if (!validator(value)) {
      return { isValid: false, error: message }
    }
    
    return { isValid: true }
  }
}

// =============================================
// COMMON VALIDATION SCHEMAS
// =============================================

/**
 * Common validation schemas for forms
 */
export const validationSchemas = {
  login: {
    email: [required('Email'), (value: string) => validateEmail(value)],
    password: [required('Password')]
  },
  
  signup: {
    username: [required('Username'), (value: string) => validateUsername(value)],
    email: [required('Email'), (value: string) => validateEmail(value)],
    password: [required('Password'), (value: string) => validatePassword(value)]
  },
  
  profile: {
    username: [required('Username'), (value: string) => validateUsername(value)],
    bio: [length(0, 500, 'Bio')],
    website: [(value: string) => validateUrl(value, false)]
  },
  
  videoUpload: {
    title: [required('Title'), length(1, 100, 'Title')],
    description: [length(0, 1000, 'Description')],
    prompt: [required('Prompt'), length(1, 2000, 'Prompt')],
    model: [required('Model')]
  }
} as const