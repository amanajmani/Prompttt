'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils'

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

export interface ToastProps extends Omit<Toast, 'id'> {
  onDismiss: () => void
  className?: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast icons
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

// Toast variants
const toastVariants = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
}

const iconVariants = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
}

export const ToastComponent = React.forwardRef<HTMLDivElement, ToastProps>(
  ({
    title,
    description,
    type = 'info',
    action,
    dismissible = true,
    onDismiss,
    className,
    ...props
  }, ref) => {
    const Icon = toastIcons[type]

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(
          'relative flex items-start gap-3 p-4 border rounded-lg shadow-lg',
          'animate-in slide-in-from-right-full duration-300',
          'max-w-md w-full',
          toastVariants[type],
          className
        )}
        {...props}
      >
        {/* Icon */}
        <Icon size={20} className={cn('flex-shrink-0 mt-0.5', iconVariants[type])} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-2 text-sm font-medium underline hover:no-underline',
                'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2',
                'transition-all duration-200'
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2',
              'transition-all duration-200 touch-target'
            )}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }
)

ToastComponent.displayName = 'Toast'

// Toast container component
export const ToastContainer: React.FC<{
  toasts: Toast[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  className?: string
}> = ({ 
  toasts, 
  onDismiss, 
  position = 'top-right',
  className 
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  if (toasts.length === 0) return null

  return createPortal(
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClasses[position],
        className
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent
            {...toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}

// Toast provider component
export const ToastProvider: React.FC<{
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      return updated.slice(0, maxToasts)
    })

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={removeToast} 
        position={position}
      />
    </ToastContext.Provider>
  )
}

// Convenience functions
export const toast = {
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    // This will be implemented when used with ToastProvider
    console.log('Toast success:', message, options)
  },
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.log('Toast error:', message, options)
  },
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.log('Toast warning:', message, options)
  },
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.log('Toast info:', message, options)
  },
}

// Hook to create toast functions
export const useToastActions = () => {
  const { addToast } = useToast()

  return {
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
      return addToast({ 
        type: 'success', 
        description: message, 
        ...options 
      })
    },
    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
      return addToast({ 
        type: 'error', 
        description: message, 
        duration: 7000, // Longer for errors
        ...options 
      })
    },
    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
      return addToast({ 
        type: 'warning', 
        description: message, 
        ...options 
      })
    },
    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
      return addToast({ 
        type: 'info', 
        description: message, 
        ...options 
      })
    },
  }
}