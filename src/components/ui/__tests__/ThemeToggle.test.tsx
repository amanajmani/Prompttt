import { render, screen } from '@/utils/test-utils'
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
  })

  describe('Basic functionality', () => {
    it('renders all theme options', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /switch to system theme/i })).toBeInTheDocument()
    })

    it('shows current theme as active', () => {
      render(<ThemeToggle />)
      
      const darkButton = screen.getByRole('button', { name: /switch to dark theme/i })
      expect(darkButton).toHaveClass('bg-accent', 'text-white')
    })

    it('calls setTheme when theme button is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const lightButton = screen.getByRole('button', { name: /switch to light theme/i })
      await user.click(lightButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
  })

  describe('Icons and labels', () => {
    it('displays correct icons for each theme', () => {
      render(<ThemeToggle />)
      
      // Check that icons are present (Lucide icons have data-lucide attribute)
      expect(screen.getByRole('button', { name: /light/i }).querySelector('[data-lucide="sun"]')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /dark/i }).querySelector('[data-lucide="moon"]')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /system/i }).querySelector('[data-lucide="monitor"]')).toBeInTheDocument()
    })

    it('shows labels on larger screens', () => {
      render(<ThemeToggle />)
      
      // Labels should be hidden on mobile (sm:inline class)
      const lightButton = screen.getByRole('button', { name: /light/i })
      const labelSpan = lightButton.querySelector('span')
      expect(labelSpan).toHaveClass('hidden', 'sm:inline')
    })
  })

  describe('Touch-friendly design', () => {
    it('has proper touch target size', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('touch-target')
      })
    })

    it('has responsive padding', () => {
      render(<ThemeToggle />)
      
      const lightButton = screen.getByRole('button', { name: /light/i })
      expect(lightButton).toHaveClass('px-2', 'sm:px-3')
    })
  })

  describe('Theme switching for different themes', () => {
    it('handles light theme selection', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const lightButton = screen.getByRole('button', { name: /switch to light theme/i })
      await user.click(lightButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('handles system theme selection', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const systemButton = screen.getByRole('button', { name: /switch to system theme/i })
      await user.click(systemButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByRole('button', { name: /switch to light theme/i })).toHaveAttribute('aria-label')
      expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute('aria-label')
      expect(screen.getByRole('button', { name: /switch to system theme/i })).toHaveAttribute('aria-label')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      // Tab through the buttons
      await user.tab()
      await user.tab()
      await user.tab()
      
      // Should be able to activate with Enter
      await user.keyboard('{Enter}')
      expect(mockSetTheme).toHaveBeenCalled()
    })
  })
})

describe('ThemeToggleCompact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders compact toggle button', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-12', 'w-12') // Mobile size
    })

    it('shows correct icon based on current theme', () => {
      // Test with dark theme (should show sun icon for switching to light)
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button.querySelector('[data-lucide="sun"]')).toBeInTheDocument()
    })

    it('toggles between light and dark themes', async () => {
      const user = userEvent.setup()
      
      // Start with dark theme
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
  })

  describe('Responsive design', () => {
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

  describe('Visual states', () => {
    it('has proper hover states', () => {
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

  describe('Theme context integration', () => {
    it('responds to theme changes', () => {
      // Test with light theme
      const lightMockContext = { ...mockThemeContext, resolvedTheme: 'light' as const }
      jest.mocked(require('@/contexts/ThemeContext').useTheme).mockReturnValue(lightMockContext)
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button.querySelector('[data-lucide="moon"]')).toBeInTheDocument()
    })

    it('has correct ARIA label based on current theme', () => {
      mockThemeContext.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button', { name: /switch to light theme/i })
      expect(button).toBeInTheDocument()
    })
  })
})