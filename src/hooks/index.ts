/**
 * Custom Hooks Index
 * Centralized export of all custom hooks
 */

// State Management Hooks
export { useLocalStorage } from './useLocalStorage'
export { useToggle, useMultiToggle } from './useToggle'

// Form and Validation Hooks
export { useForm } from './useForm'
export type { 
  ValidationRule, 
  FieldConfig, 
  FormConfig, 
  FormState, 
  FormActions 
} from './useForm'

// Performance Hooks
export { useDebounce, useDebouncedCallback, useThrottle } from './useDebounce'

// Responsive and UI Hooks
export { 
  useResponsive, 
  useResponsiveValue, 
  useTouchDevice 
} from './useResponsive'

// Existing hooks
export { useSupabase } from './useSupabase'