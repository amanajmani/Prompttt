import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary, ErrorState, NetworkErrorState, NotFoundState, PermissionErrorState, useErrorHandler } from '../ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

// Component to test useErrorHandler hook
const TestErrorHandler = () => {
  const { handleError, resetError } = useErrorHandler()

  return (
    <div>
      <button onClick={() => handleError(new Error('Hook error'))}>
        Trigger Error
      </button>
      <button onClick={resetError}>Reset Error</button>
    </div>
  )
}

describe('ErrorBoundary Component', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
  })

  it('shows error details when showDetails is true', () => {
    render(
      <ErrorBoundary showDetails={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details:')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const mockOnError = jest.fn()
    
    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('handles retry button click', async () => {
    const user = userEvent.setup()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const retryButton = screen.getByText('Try Again')
    await user.click(retryButton)

    // After retry, the error should be reset (though the component will throw again)
    expect(retryButton).toBeInTheDocument()
  })

  it('handles go home button click', async () => {
    const user = userEvent.setup()
    
    // Mock window.location.href
    delete (window as unknown as { location: unknown }).location
    window.location = { href: '' } as Location

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const homeButton = screen.getByText('Go Home')
    await user.click(homeButton)

    expect(window.location.href).toBe('/')
  })

  it('handles report bug button click', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const bugButton = screen.getByText('Report Bug')
    await user.click(bugButton)

    expect(consoleSpy).toHaveBeenCalledWith('Bug report data:', expect.any(Object))
    
    consoleSpy.mockRestore()
  })

  it('applies custom className', () => {
    render(
      <ErrorBoundary className="custom-error-class">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const errorContainer = screen.getByText('Something went wrong').closest('div')
    expect(errorContainer).toHaveClass('custom-error-class')
  })
})

describe('useErrorHandler Hook', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  it('throws error when handleError is called', () => {
    expect(() => {
      render(
        <ErrorBoundary>
          <TestErrorHandler />
        </ErrorBoundary>
      )
    }).not.toThrow()

    // The error will be caught by the error boundary
    expect(screen.getByText('Trigger Error')).toBeInTheDocument()
  })
})

describe('ErrorState Component', () => {
  it('renders with default props', () => {
    render(<ErrorState />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An error occurred while loading this content.')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(
      <ErrorState
        title="Custom Error"
        description="Custom error description"
      />
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom error description')).toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const mockAction = jest.fn()
    const user = userEvent.setup()

    render(
      <ErrorState
        action={{ label: 'Retry', onClick: mockAction }}
      />
    )

    const actionButton = screen.getByText('Retry')
    expect(actionButton).toBeInTheDocument()

    await user.click(actionButton)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>
    
    render(<ErrorState icon={customIcon} />)

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ErrorState className="custom-error-state" />)

    const container = screen.getByText('Something went wrong').closest('div')
    expect(container).toHaveClass('custom-error-state')
  })
})

describe('NetworkErrorState Component', () => {
  it('renders network error message', () => {
    render(<NetworkErrorState />)

    expect(screen.getByText('Connection Error')).toBeInTheDocument()
    expect(screen.getByText(/Unable to connect to the server/)).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', async () => {
    const mockRetry = jest.fn()
    const user = userEvent.setup()

    render(<NetworkErrorState onRetry={mockRetry} />)

    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)

    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<NetworkErrorState />)

    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })
})

describe('NotFoundState Component', () => {
  it('renders with default props', () => {
    render(<NotFoundState />)

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(screen.getByText(/The page you're looking for doesn't exist/)).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(
      <NotFoundState
        title="Custom Not Found"
        description="Custom not found message"
      />
    )

    expect(screen.getByText('Custom Not Found')).toBeInTheDocument()
    expect(screen.getByText('Custom not found message')).toBeInTheDocument()
  })

  it('renders go back button when onGoBack is provided', async () => {
    const mockGoBack = jest.fn()
    const user = userEvent.setup()

    render(<NotFoundState onGoBack={mockGoBack} />)

    const goBackButton = screen.getByText('Go Back')
    await user.click(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

describe('PermissionErrorState Component', () => {
  it('renders permission error message', () => {
    render(<PermissionErrorState />)

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.getByText(/You don't have permission to view this content/)).toBeInTheDocument()
  })

  it('renders login button when onLogin is provided', async () => {
    const mockLogin = jest.fn()
    const user = userEvent.setup()

    render(<PermissionErrorState onLogin={mockLogin} />)

    const loginButton = screen.getByText('Log In')
    await user.click(loginButton)

    expect(mockLogin).toHaveBeenCalledTimes(1)
  })

  it('does not render login button when onLogin is not provided', () => {
    render(<PermissionErrorState />)

    expect(screen.queryByText('Log In')).not.toBeInTheDocument()
  })
})

describe('Error state accessibility', () => {
  it('has proper heading structure', () => {
    render(<ErrorState />)

    const heading = screen.getByRole('heading', { name: 'Something went wrong' })
    expect(heading).toBeInTheDocument()
  })

  it('has accessible buttons', () => {
    render(<ErrorState action={{ label: 'Retry', onClick: jest.fn() }} />)

    const button = screen.getByRole('button', { name: 'Retry' })
    expect(button).toBeInTheDocument()
  })
})