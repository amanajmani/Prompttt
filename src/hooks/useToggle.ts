'use client'

import { useState, useCallback } from 'react'

/**
 * Hook for boolean toggle state management
 * Provides clean API for toggle operations
 */
export function useToggle(initialValue = false): [boolean, {
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
  setValue: (value: boolean) => void
}] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(prev => !prev), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [
    value,
    {
      toggle,
      setTrue,
      setFalse,
      setValue,
    }
  ]
}

/**
 * Hook for managing multiple toggle states
 */
export function useMultiToggle<T extends string>(
  keys: readonly T[],
  initialValues?: Partial<Record<T, boolean>>
): [
  Record<T, boolean>,
  {
    toggle: (key: T) => void
    setTrue: (key: T) => void
    setFalse: (key: T) => void
    setValue: (key: T, value: boolean) => void
    reset: () => void
  }
] {
  const [values, setValues] = useState<Record<T, boolean>>(() => {
    const initial = {} as Record<T, boolean>
    keys.forEach(key => {
      initial[key] = initialValues?.[key] ?? false
    })
    return initial
  })

  const toggle = useCallback((key: T) => {
    setValues(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const setTrue = useCallback((key: T) => {
    setValues(prev => ({ ...prev, [key]: true }))
  }, [])

  const setFalse = useCallback((key: T) => {
    setValues(prev => ({ ...prev, [key]: false }))
  }, [])

  const setValue = useCallback((key: T, value: boolean) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    const resetValues = {} as Record<T, boolean>
    keys.forEach(key => {
      resetValues[key] = initialValues?.[key] ?? false
    })
    setValues(resetValues)
  }, [keys, initialValues])

  return [
    values,
    {
      toggle,
      setTrue,
      setFalse,
      setValue,
      reset,
    }
  ]
}