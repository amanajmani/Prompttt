import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock matchMedia
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
})

// Test component that uses the theme context
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          remove: jest.fn(),
          add: jest.fn(),
        },
        setAttribute: jest.fn(),
      },
      writable: true,
    })
    
    // Default matchMedia mock
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
  })

  describe('ThemeProvider', () => {
    it('provides theme context to children', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
      expect(screen.getByTestId('resolved-theme')).toBeInTheDocument()
    })

    it('initializes with system theme by default', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    })

    it('loads saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('prompttt-theme')
    })

    it('ignores invalid theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    })
  })

  describe('Theme switching', () => {
    it('allows switching to light theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-light'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
    })

    it('allows switching to dark theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-dark'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
    })

    it('allows switching to system theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-system'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
      })
    })
  })

  describe('System theme detection', () => {
    it('resolves to light when system prefers light', async () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // prefers-color-scheme: dark is false
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-system'))
      
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
    })

    it('resolves to dark when system prefers dark', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // prefers-color-scheme: dark is true
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-system'))
      
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
    })
  })

  describe('DOM updates', () => {
    it('applies theme classes to document element', async () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      }
      const mockSetAttribute = jest.fn()
      
      Object.defineProperty(document, 'documentElement', {
        value: {
          classList: mockClassList,
          setAttribute: mockSetAttribute,
        },
        writable: true,
      })
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-light'))
      
      await waitFor(() => {
        expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark')
        expect(mockClassList.add).toHaveBeenCalledWith('light')
        expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light')
      })
    })

    it('saves theme to localStorage', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-dark'))
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('prompttt-theme', 'dark')
      })
    })
  })

  describe('System theme change listener', () => {
    it('sets up media query listener for system theme', async () => {
      const mockAddEventListener = jest.fn()
      const mockRemoveEventListener = jest.fn()
      
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })
      
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-system'))
      
      await waitFor(() => {
        expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })
      
      unmount()
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('does not set up listener for non-system themes', async () => {
      const mockAddEventListener = jest.fn()
      
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
      })
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      fireEvent.click(screen.getByTestId('set-light'))
      
      await waitFor(() => {
        expect(mockAddEventListener).not.toHaveBeenCalled()
      })
    })
  })

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useTheme must be used within a ThemeProvider')
      
      consoleSpy.mockRestore()
    })

    it('returns theme context when used within ThemeProvider', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    })
  })

  describe('Server-side rendering', () => {
    it('handles missing window object gracefully', () => {
      // Mock window as undefined
      const originalWindow = global.window
      delete (global as any).window
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      
      // Restore window
      global.window = originalWindow
    })
  })
})