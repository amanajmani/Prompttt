/**
 * Abstractions Index
 * Centralized export of all abstractions and utilities
 */

// Style System
export {
  createVariantSystem,
  createSizeSystem,
  createResponsiveClasses,
  buttonVariants,
  buttonSizes,
  inputVariants,
  cardVariants,
  animations,
  createAnimationClasses,
  focusRing,
  touchTarget,
  srOnly,
  createInteractiveClasses
} from './StyleSystem'

export type {
  VariantConfig,
  SizeConfig,
  SizeVariants,
  ResponsiveConfig
} from './StyleSystem'

// Validation System
export {
  validateRequired,
  validateEmail,
  validatePassword,
  validateUsername,
  validateUrl,
  validateLength,
  validateFile,
  validateMultiple,
  validateFormData,
  required,
  length,
  pattern,
  custom,
  validationSchemas
} from './ValidationRules'

export type {
  ValidationResult
} from './ValidationRules'