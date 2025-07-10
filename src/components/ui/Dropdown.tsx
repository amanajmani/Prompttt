'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/utils'

export interface DropdownItem {
  id: string
  label: string
  value: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

export interface DropdownProps {
  items: DropdownItem[]
  value?: string
  onSelect: (item: DropdownItem) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  searchable?: boolean
  multiSelect?: boolean
  maxHeight?: number
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  className?: string
}

const dropdownSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm', 
  lg: 'h-12 px-6 text-base'
}

const dropdownVariants = {
  default: 'bg-secondary-surface border-border hover:bg-secondary-surface/80',
  outline: 'bg-transparent border-border hover:bg-secondary-surface',
  ghost: 'bg-transparent border-transparent hover:bg-secondary-surface'
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({
    items,
    value,
    onSelect,
    placeholder = 'Select an option...',
    disabled = false,
    error,
    label,
    className,
    size = 'md',
    variant = 'default',
    searchable = false,
    multiSelect = false,
    maxHeight = 200,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItems, setSelectedItems] = useState<string[]>(
      multiSelect ? (Array.isArray(value) ? value : value ? [value] : []) : []
    )
    
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number }>()

    // Focus trap for accessibility (future enhancement)
    // const focusableElements = useRef<HTMLElement[]>([])

    const selectedItem = items.find(item => item.value === value)
    const filteredItems = searchable 
      ? items.filter(item => 
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items

    // Calculate menu position
    const calculatePosition = useCallback(() => {
      if (!triggerRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top

      const menuHeight = Math.min(maxHeight + 40, 300) // Account for padding
      const shouldOpenUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow

      setMenuPosition({
        top: shouldOpenUpward 
          ? triggerRect.top - menuHeight - 4
          : triggerRect.bottom + 4,
        left: triggerRect.left,
        width: triggerRect.width
      })
    }, [])

    // Handle item selection
    const handleSelect = (item: DropdownItem) => {
      if (item.disabled) return

      if (multiSelect) {
        const newSelection = selectedItems.includes(item.value)
          ? selectedItems.filter(id => id !== item.value)
          : [...selectedItems, item.value]
        setSelectedItems(newSelection)
        onSelect({ ...item, value: newSelection.join(',') })
      } else {
        onSelect(item)
        setIsOpen(false)
      }
    }

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          }
          break
        case 'Escape':
          setIsOpen(false)
          triggerRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            // Focus first item
            const firstItem = menuRef.current?.querySelector('[role="option"]:not([aria-disabled="true"])') as HTMLElement
            firstItem?.focus()
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          if (isOpen) {
            // Focus last item
            const items = menuRef.current?.querySelectorAll('[role="option"]:not([aria-disabled="true"])') as NodeListOf<HTMLElement>
            const lastItem = items[items.length - 1]
            lastItem?.focus()
          }
          break
      }
    }

    // Handle menu item keyboard navigation
    const handleMenuKeyDown = (event: React.KeyboardEvent, item: DropdownItem, index: number) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleSelect(item)
          break
        case 'ArrowDown':
          event.preventDefault()
          const nextItem = menuRef.current?.querySelectorAll('[role="option"]:not([aria-disabled="true"])')[index + 1] as HTMLElement
          nextItem?.focus()
          break
        case 'ArrowUp':
          event.preventDefault()
          const prevItem = menuRef.current?.querySelectorAll('[role="option"]:not([aria-disabled="true"])')[index - 1] as HTMLElement
          if (prevItem) {
            prevItem.focus()
          } else {
            triggerRef.current?.focus()
          }
          break
        case 'Escape':
          setIsOpen(false)
          triggerRef.current?.focus()
          break
      }
    }

    // Click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current && 
          menuRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        calculatePosition()
        
        // Focus search input if searchable
        if (searchable) {
          setTimeout(() => searchRef.current?.focus(), 0)
        }
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, searchable, calculatePosition])

    // Reset search when closed
    useEffect(() => {
      if (!isOpen) {
        setSearchTerm('')
      }
    }, [isOpen])

    const renderSelectedValue = () => {
      if (multiSelect && selectedItems.length > 0) {
        const selectedLabels = items
          .filter(item => selectedItems.includes(item.value))
          .map(item => item.label)
        
        if (selectedLabels.length === 1) {
          return selectedLabels[0]
        }
        return `${selectedLabels.length} selected`
      }
      
      return selectedItem?.label || placeholder
    }

    const menu = isOpen && menuPosition ? (
      <div
        ref={menuRef}
        className={cn(
          'fixed z-50 bg-secondary-surface border border-border rounded-lg shadow-lg',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width,
          maxHeight: maxHeight
        }}
        role="listbox"
        aria-multiselectable={multiSelect}
      >
        {searchable && (
          <div className="p-2 border-b border-border">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-sm bg-primary-bg border border-border rounded',
                'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent'
              )}
            />
          </div>
        )}
        
        <div className="max-h-48 overflow-y-auto p-1">
          {filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-sm text-low">
              {searchTerm ? 'No results found' : 'No options available'}
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                role="option"
                aria-selected={multiSelect ? selectedItems.includes(item.value) : value === item.value}
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : 0}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer',
                  'focus:outline-none focus:bg-accent focus:text-white',
                  'hover:bg-accent hover:text-white transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-current',
                  (multiSelect ? selectedItems.includes(item.value) : value === item.value) && 'bg-accent/10 text-accent'
                )}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => handleMenuKeyDown(e, item, index)}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-low truncate">{item.description}</div>
                  )}
                </div>
                
                {(multiSelect ? selectedItems.includes(item.value) : value === item.value) && (
                  <Check size={16} className="flex-shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    ) : null

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-high mb-2">
            {label}
          </label>
        )}
        
        <button
          ref={ref || triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full flex items-center justify-between border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
            'transition-all duration-200 ease-in-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            dropdownSizes[size],
            dropdownVariants[variant],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...props}
        >
          <span className={cn(
            'truncate text-left',
            !selectedItem && !multiSelect && 'text-low'
          )}>
            {renderSelectedValue()}
          </span>
          
          <ChevronDown 
            size={16} 
            className={cn(
              'flex-shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} 
          />
        </button>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        {typeof window !== 'undefined' && createPortal(menu, document.body)}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

// Simple dropdown menu for actions/navigation
export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({
    trigger,
    children,
    align = 'start',
    side = 'bottom',
    offset = 4,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current && 
          menuRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    return (
      <div className="relative" ref={ref} {...props}>
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              'absolute z-50 min-w-[8rem] bg-secondary-surface border border-border rounded-lg shadow-lg p-1',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              side === 'bottom' && 'top-full',
              side === 'top' && 'bottom-full',
              side === 'left' && 'right-full top-0',
              side === 'right' && 'left-full top-0',
              align === 'start' && (side === 'bottom' || side === 'top') && 'left-0',
              align === 'center' && (side === 'bottom' || side === 'top') && 'left-1/2 -translate-x-1/2',
              align === 'end' && (side === 'bottom' || side === 'top') && 'right-0',
              className
            )}
            style={{
              [side === 'bottom' ? 'marginTop' : side === 'top' ? 'marginBottom' : 
               side === 'left' ? 'marginRight' : 'marginLeft']: `${offset}px`
            }}
          >
            {children}
          </div>
        )}
      </div>
    )
  }
)

DropdownMenu.displayName = 'DropdownMenu'

// Dropdown menu item
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  className?: string
}>(({ children, onClick, disabled, destructive, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer',
        'focus:outline-none focus:bg-accent focus:text-white',
        'hover:bg-accent hover:text-white transition-colors',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-current',
        destructive && 'text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500',
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault()
          onClick?.()
        }
      }}
      {...props}
    >
      {children}
    </div>
  )
})

DropdownMenuItem.displayName = 'DropdownMenuItem'

// Dropdown separator
export const DropdownSeparator = React.forwardRef<HTMLDivElement, {
  className?: string
}>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn('h-px bg-border my-1', className)}
      {...props}
    />
  )
})

DropdownSeparator.displayName = 'DropdownSeparator'