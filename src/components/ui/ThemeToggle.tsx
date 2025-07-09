'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div className="flex items-center rounded-lg border border-border bg-secondary-surface p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'touch-target flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-all',
            'hover:bg-primary-bg hover:text-high',
            'sm:px-3', // More padding on larger screens
            theme === value
              ? 'bg-accent text-white shadow-sm'
              : 'text-medium hover:text-high'
          )}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'touch-target-comfortable flex items-center justify-center rounded-lg border border-border',
        'bg-secondary-surface text-medium transition-all',
        'hover:bg-accent hover:text-white hover:border-accent',
        'h-12 w-12 sm:h-10 sm:w-10' // Larger on mobile for better touch targets
      )}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}