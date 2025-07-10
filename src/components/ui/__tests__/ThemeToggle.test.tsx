import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle, ThemeToggleCompact } from '../ThemeToggle'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: ({ size }: { size?: number }) => <div data-testid="moon-icon" data-size={size} />,
  Sun: ({ size }: { size?: number }) => <div data-testid="sun-icon" data-size={size} />,
  Monitor: ({ size }: { size?: number }) => <div data-testid="monitor-icon" data-size={size} />,
}))

// Mock the theme context
const mockSetTheme = jest.fn()
const mockUseTheme = {
  theme: 'light' as const,
  resolvedTheme: 'light' as const,
  setTheme: mockSetTheme,
}

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders all theme options', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument()
    })

    it('displays correct icons for each theme', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
      expect(screen.getByTestId('monitor-icon')).toBeInTheDocument()
    })

    it('shows theme labels on larger screens', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('System')).toBeInTheDocument()
    })
  })

  describe('Theme switching', () => {
    it('calls setTheme when light theme button is clicked', () => {
      render(<ThemeToggle />)
      
      fireEvent.click(screen.getByLabelText('Switch to Light theme'))
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('calls setTheme when dark theme button is clicked', () => {
      render(<ThemeToggle />)
      
      fireEvent.click(screen.getByLabelText('Switch to Dark theme'))
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('calls setTheme when system theme button is clicked', () => {
      render(<ThemeToggle />)
      
      fireEvent.click(screen.getByLabelText('Switch to System theme'))
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
  })

  describe('Active state styling', () => {
    it('applies active styling to current theme', () => {
      mockUseTheme.theme = 'dark'
      render(<ThemeToggle />)
      
      const darkButton = screen.getByLabelText('Switch to Dark theme')
      expect(darkButton).toHaveClass('bg-accent', 'text-white')
    })

    it('applies inactive styling to non-current themes', () => {
      mockUseTheme.theme = 'dark'
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to Light theme')
      expect(lightButton).toHaveClass('text-medium')
      expect(lightButton).not.toHaveClass('bg-accent')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for each theme button', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument()
    })

    it('has proper touch target classes', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('touch-target')
      })
    })
  })

  describe('Responsive design', () => {
    it('has responsive padding classes', () => {
      render(<ThemeToggle />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('sm:px-3')
      })
    })

    it('hides labels on small screens', () => {
      render(<ThemeToggle />)
      
      const labels = screen.getAllByText(/Light|Dark|System/)
      labels.forEach(label => {
        expect(label).toHaveClass('hidden', 'sm:inline')
      })
    })
  })
})

describe('ThemeToggleCompact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders compact theme toggle', () => {
      render(<ThemeToggleCompact />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('shows sun icon when in dark theme', () => {
      mockUseTheme.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
    })

    it('shows moon icon when in light theme', () => {
      mockUseTheme.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
    })
  })

  describe('Theme toggling', () => {
    it('switches to light theme when currently dark', () => {
      mockUseTheme.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      fireEvent.click(screen.getByRole('button'))
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('switches to dark theme when currently light', () => {
      mockUseTheme.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      fireEvent.click(screen.getByRole('button'))
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA label for dark theme', () => {
      mockUseTheme.resolvedTheme = 'dark'
      render(<ThemeToggleCompact />)
      
      expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
    })

    it('has proper ARIA label for light theme', () => {
      mockUseTheme.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
    })

    it('has touch-friendly sizing', () => {
      render(<ThemeToggleCompact />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('touch-target-comfortable')
      expect(button).toHaveClass('h-12', 'w-12', 'sm:h-10', 'sm:w-10')
    })
  })

  describe('Icon sizing', () => {
    it('uses correct icon size', () => {
      mockUseTheme.resolvedTheme = 'light'
      render(<ThemeToggleCompact />)
      
      const icon = screen.getByTestId('moon-icon')
      expect(icon).toHaveAttribute('data-size', '20')
    })
  })
})