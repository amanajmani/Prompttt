'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
}

export interface DialogProps extends ModalProps {
  // Dialog is an alias for Modal with semantic meaning
  dialogSpecific?: boolean
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4'
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    children,
    title,
    description,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className,
    ...props
  }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, onClose, closeOnEscape])

    // Handle focus management
    useEffect(() => {
      if (isOpen) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement
        
        // Focus the modal
        setTimeout(() => {
          modalRef.current?.focus()
        }, 0)

        // Prevent body scroll
        document.body.style.overflow = 'hidden'
      } else {
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus()
        }
        
        // Restore body scroll
        document.body.style.overflow = 'unset'
      }

      // Cleanup on unmount
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose()
      }
    }

    if (!isOpen) return null

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          ref={ref || modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          tabIndex={-1}
          className={cn(
            'relative w-full bg-secondary-surface border border-border rounded-lg shadow-lg',
            'transform transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg',
            modalSizes[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div>
                {title && (
                  <h2 
                    id="modal-title"
                    className="font-heading font-semibold text-lg sm:text-xl text-high"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description"
                    className="mt-1 text-sm text-medium"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg transition-colors touch-manipulation',
                    'text-low hover:text-high hover:bg-border',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary-surface'
                  )}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    )

    // Render modal in portal
    return createPortal(modalContent, document.body)
  }
)

Modal.displayName = 'Modal'

// Dialog is an alias for Modal
export const Dialog = Modal
Dialog.displayName = 'Dialog'

// Confirmation Dialog Component
export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

export const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false
  }, ref) => {
    const handleConfirm = () => {
      if (!isLoading) {
        onConfirm()
      }
    }

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        size="sm"
        closeOnOverlayClick={!isLoading}
        closeOnEscape={!isLoading}
        showCloseButton={!isLoading}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation',
                'border border-border bg-transparent text-medium',
                'hover:bg-border hover:text-high',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary-surface',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-surface',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variant === 'destructive' 
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-accent text-white hover:bg-accent/90 focus:ring-accent'
              )}
            >
              {isLoading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
)

ConfirmDialog.displayName = 'ConfirmDialog'