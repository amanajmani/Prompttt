'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Upload, User, Search, Heart } from 'lucide-react'
import { cn } from '@/utils'
import { ThemeToggle } from './ThemeToggle'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  badge?: number
}

export interface HeaderProps {
  className?: string
  showSearch?: boolean
  onSearchClick?: () => void
}

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
}

export interface SidebarProps {
  className?: string
  navItems: NavItem[]
}

// Default navigation items for AI VideoHub
const defaultNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/liked', label: 'Liked', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
]

// Header Component
export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, showSearch = true, onSearchClick, ...props }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Close mobile menu when route changes
    useEffect(() => {
      setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isMobileMenuOpen])

    return (
      <>
        <header
          ref={ref}
          className={cn(
            'sticky top-0 z-40 w-full border-b border-border bg-primary-bg/95 backdrop-blur-sm',
            className
          )}
          {...props}
        >
          <div className="container mx-auto px-4">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              {/* Logo */}
              <Link 
                href="/"
                className="flex items-center space-x-2 font-heading font-bold text-xl text-high hover:text-accent transition-colors"
              >
                <span>PROMPTTT</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {defaultNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        'hover:bg-secondary-surface hover:text-high',
                        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg',
                        isActive 
                          ? 'bg-secondary-surface text-high' 
                          : 'text-medium'
                      )}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Search Button */}
                {showSearch && (
                  <button
                    onClick={onSearchClick}
                    className={cn(
                      'p-2 rounded-lg transition-colors touch-manipulation',
                      'text-medium hover:text-high hover:bg-secondary-surface',
                      'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg'
                    )}
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={cn(
                    'md:hidden p-2 rounded-lg transition-colors touch-manipulation',
                    'text-medium hover:text-high hover:bg-secondary-surface',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg'
                  )}
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={defaultNavItems}
        />
      </>
    )
  }
)

Header.displayName = 'Header'

// Mobile Menu Component
export const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose, navItems }, ref) => {
    const pathname = usePathname()

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Menu Panel */}
        <div
          ref={ref}
          className={cn(
            'absolute right-0 top-0 h-full w-80 max-w-[85vw]',
            'bg-primary-bg border-l border-border',
            'transform transition-transform duration-300 ease-out'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-heading font-bold text-lg text-high">Menu</span>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg transition-colors touch-manipulation',
                'text-medium hover:text-high hover:bg-secondary-surface',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg'
              )}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors touch-manipulation',
                        'hover:bg-secondary-surface hover:text-high',
                        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg',
                        isActive 
                          ? 'bg-secondary-surface text-high' 
                          : 'text-medium'
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-1 text-xs bg-accent text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    )
  }
)

MobileMenu.displayName = 'MobileMenu'

// Sidebar Component (for desktop layouts)
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, navItems, ...props }, ref) => {
    const pathname = usePathname()

    return (
      <aside
        ref={ref}
        className={cn(
          'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-primary-bg',
          className
        )}
        {...props}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <Link 
            href="/"
            className="font-heading font-bold text-xl text-high hover:text-accent transition-colors"
          >
            PROMPTTT
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      'hover:bg-secondary-surface hover:text-high',
                      'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg',
                      isActive 
                        ? 'bg-secondary-surface text-high' 
                        : 'text-medium'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-1 text-xs bg-accent text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-low">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    )
  }
)

Sidebar.displayName = 'Sidebar'

// Breadcrumb Component
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-2 text-sm', className)}
        {...props}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-low" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-medium hover:text-high transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-high font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'