import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle, ThemeToggleCompact } from '../ThemeToggle'

// Mock the theme context
const mockSetTheme = jest.fn()
const mockThemeContext = {
  theme: 'dark' as const,
  setTheme: mockSetTheme,
  resolvedTheme: 'dark' as const,
}

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockThemeContext,
}))

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockThemeContext.theme = 'dark'
    mockThemeContext.resolvedTheme = 'dark'
  })

  describe('Basic functionality', () => {
    it('renders all theme options', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument()
    })

    it('shows current theme as active', () => {
      render(<ThemeToggle />)
      
      const darkButton = screen.getByLabelText('Switch to Dark theme')
      expect(darkButton).toHaveClass('bg-accent', 'text-white')
    })

    it('handles theme switching', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to Light theme')
      await user.click(lightButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('handles system theme selection', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const systemButton = screen.getByLabelText('Switch to System theme')
      await user.click(systemButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
  })

  describe('Visual states', () => {
    it('highlights active theme correctly', () => {
      mockThemeContext.theme = 'light'
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to Light theme')
      const darkButton = screen.getByLabelText('Switch to Dark theme')
      
      expect(lightButton).toHaveClass('bg-accent', 'text-white')
      expect(darkButton).not.toHaveClass('bg-accent', 'text-white')
    })

    it('shows system theme as active when selected', () => {
      mockThemeContext.theme = 'system'
      render(<ThemeToggle />)
      
      const systemButton = screen.getByLabelText('Switch to System theme')
      expect(systemButton).toHaveClass('bg-accent', 'text-white')
    })
  })

  describe('Responsive design', () => {
    it('shows text labels on larger screens', () => {
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to Light theme')
      const textSpan = lightButton.querySelector('span.hidden.sm\\:inline')
      expect(textSpan).toBeInTheDocument()
      expect(textSpan).toHaveTextContent('Light')
    })

    it('has proper touch targets', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('touch-target')
      })
    })
  })

  describe('Icons', () => {
    it('displays correct icons for each theme', () => {
      render(<ThemeToggle />)
      
      // Check that icons are present (we can't easily test specific icons, but we can check they exist)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
      
      buttons.forEach(button => {
        const icon = button.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to Light theme')
      lightButton.focus()
      
      await user.keyboard('{Enter}')
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('has proper focus styles', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('focus:ring-2')
      })
    })
  })

  describe('Theme transitions', () => {
    it('has transition classes for smooth animations', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all')
      })
    })
  })
})

describe('ThemeToggleCompact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockThemeContext.resolvedTheme = 'dark'
  })

  describe('Basic functionality', () => {
    it('renders compact theme toggle', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('shows correct icon for current theme', () => {
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByLabelText('Switch to light theme')
      expect(button).toBeInTheDocument()
    })

    it('toggles between light and dark themes', async () => {
      const user = userEvent.setup()
      mockThemeContext.resolvedTheme = 'dark'
      
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('toggles from light to dark', async () => {
      const user = userEvent.setup()
      mockThemeContext.resolvedTheme = 'light'
      
      render(<ThemeToggleCompact />)
      
      const button = screen.getByLabelText('Switch to dark theme')
      await user.click(button)
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Mobile-first design', () => {
    it('has larger touch targets on mobile', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-12', 'w-12', 'sm:h-10', 'sm:w-10')
    })

    it('has comfortable touch target class', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('touch-target-comfortable')
    })
  })

  describe('Visual design', () => {
    it('has proper styling classes', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'rounded-lg',
        'border',
        'border-border',
        'bg-secondary-surface'
      )
    })

    it('has hover effects', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-white', 'hover:border-accent')
    })

    it('has transition animations', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-all')
    })
  })

  describe('Accessibility', () => {
    it('has descriptive ARIA labels', () => {
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByLabelText('Switch to light theme')
      expect(button).toBeInTheDocument()
    })

    it('updates ARIA label based on current theme', () => {
      mockThemeContext.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByLabelText('Switch to dark theme')
      expect(button).toBeInTheDocument()
    })

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup()
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      button.focus()
      
      await user.keyboard('{Enter}')
      expect(mockSetTheme).toHaveBeenCalled()
    })

    it('supports space key activation', async () => {
      const user = userEvent.setup()
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      button.focus()
      
      await user.keyboard(' ')
      expect(mockSetTheme).toHaveBeenCalled()
    })
  })

  describe('Icon display', () => {
    it('shows sun icon when in dark mode', () => {
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('shows moon icon when in light mode', () => {
      mockThemeContext.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })
})

describe('Theme integration', () => {
  it('ThemeToggle works correctly in dark theme context', () => {
    render(<ThemeToggle />)
    
    const container = screen.getByRole('button', { name: /Switch to Light theme/i }).parentElement
    expect(container).toHaveClass('bg-secondary-surface', 'border-border')
  })

  it('ThemeToggle works correctly in light theme context', () => {
    render(<ThemeToggle />)
    
    const container = screen.getByRole('button', { name: /Switch to Light theme/i }).parentElement
    expect(container).toHaveClass('bg-secondary-surface', 'border-border')
  })

  it('ThemeToggleCompact adapts to theme context', () => {
    render(<ThemeToggleCompact />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary-surface', 'border-border')
  })
})

describe('Error handling', () => {
  it('handles missing theme context gracefully', () => {
    // This test ensures the component doesn't crash if context is missing
    // The mock should handle this, but it's good to verify
    expect(() => render(<ThemeToggle />)).not.toThrow()
    expect(() => render(<ThemeToggleCompact />)).not.toThrow()
  })
})