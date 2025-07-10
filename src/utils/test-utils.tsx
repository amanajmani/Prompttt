// Testing utilities for PROMPTTT components
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark' | 'system'
}

const AllTheProviders = ({ 
  children, 
  theme = 'dark' 
}: { 
  children: React.ReactNode
  theme?: 'light' | 'dark' | 'system'
}) => {
  // Mock localStorage for theme persistence
  const mockLocalStorage = {
    getItem: jest.fn(() => theme),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  
  // Override localStorage for this test
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { theme, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} theme={theme} />,
    ...renderOptions,
  })
}

// Theme testing utilities
export const renderWithTheme = (
  ui: ReactElement,
  theme: 'light' | 'dark' = 'dark'
) => {
  return customRender(ui, { theme })
}

// Mobile viewport testing utility
export const setMobileViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375, // iPhone viewport width
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Desktop viewport testing utility
export const setDesktopViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })
  
  window.dispatchEvent(new Event('resize'))
}

// Mock touch events for mobile testing
export const mockTouchEvents = () => {
  const createTouchEvent = (type: string, touches: Touch[] = []) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'touches', {
      value: touches,
      writable: false,
    })
    return event
  }

  return {
    touchStart: (element: Element, touches: Touch[] = []) => {
      element.dispatchEvent(createTouchEvent('touchstart', touches))
    },
    touchEnd: (element: Element, touches: Touch[] = []) => {
      element.dispatchEvent(createTouchEvent('touchend', touches))
    },
    touchMove: (element: Element, touches: Touch[] = []) => {
      element.dispatchEvent(createTouchEvent('touchmove', touches))
    },
  }
}

// Accessibility testing helper
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe')
  expect.extend(toHaveNoViolations)
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Animation testing utilities
export const waitForAnimation = (duration = 300) => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Mock intersection observer for animation testing
export const mockIntersectionObserver = (isIntersecting = true) => {
  const mockObserver = jest.fn().mockImplementation((callback) => {
    // Immediately trigger the callback
    callback([{ isIntersecting }])
    
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }
  })
  
  window.IntersectionObserver = mockObserver
  return mockObserver
}

// Theme switching test helper
export const testThemeSwitch = async (getByRole: any) => {
  const themeToggle = getByRole('button', { name: /switch to light theme/i })
  
  // Test theme switching
  fireEvent.click(themeToggle)
  
  // Wait for theme to apply
  await waitFor(() => {
    expect(document.documentElement).toHaveClass('light')
  })
}

// Component testing patterns
export const testResponsiveComponent = (
  Component: React.ComponentType<any>,
  props: any = {}
) => {
  describe('Responsive behavior', () => {
    it('renders correctly on mobile', () => {
      setMobileViewport()
      const { container } = customRender(<Component {...props} />)
      expect(container.firstChild).toBeInTheDocument()
    })
    
    it('renders correctly on desktop', () => {
      setDesktopViewport()
      const { container } = customRender(<Component {...props} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
}

export const testThemeComponent = (
  Component: React.ComponentType<any>,
  props: any = {}
) => {
  describe('Theme support', () => {
    it('renders correctly in dark theme', () => {
      const { container } = renderWithTheme(<Component {...props} />, 'dark')
      expect(container.firstChild).toBeInTheDocument()
    })
    
    it('renders correctly in light theme', () => {
      const { container } = renderWithTheme(<Component {...props} />, 'light')
      expect(container.firstChild).toBeInTheDocument()
    })
  })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Export custom render as default
export { customRender as render }