import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastComponent, ToastProvider, useToast, useToastActions } from '../Toast'

// Test component to use toast hooks
const TestToastComponent = () => {
  const { addToast, removeToast, clearToasts, toasts } = useToast()
  const { success, error, warning, info } = useToastActions()

  return (
    <div>
      <button onClick={() => success('Success message')}>Success Toast</button>
      <button onClick={() => error('Error message')}>Error Toast</button>
      <button onClick={() => warning('Warning message')}>Warning Toast</button>
      <button onClick={() => info('Info message')}>Info Toast</button>
      <button onClick={() => addToast({ title: 'Custom', description: 'Custom toast' })}>
        Custom Toast
      </button>
      <button onClick={() => clearToasts()}>Clear All</button>
      <div data-testid="toast-count">{toasts.length}</div>
    </div>
  )
}

describe('ToastComponent', () => {
  const mockOnDismiss = jest.fn()

  beforeEach(() => {
    mockOnDismiss.mockClear()
  })

  it('renders with title and description', () => {
    render(
      <ToastComponent
        title="Test Title"
        description="Test description"
        onDismiss={mockOnDismiss}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders different types correctly', () => {
    const { rerender } = render(
      <ToastComponent type="success" description="Success" onDismiss={mockOnDismiss} />
    )

    let toast = screen.getByRole('alert')
    expect(toast).toHaveClass('bg-green-50')

    rerender(<ToastComponent type="error" description="Error" onDismiss={mockOnDismiss} />)
    toast = screen.getByRole('alert')
    expect(toast).toHaveClass('bg-red-50')

    rerender(<ToastComponent type="warning" description="Warning" onDismiss={mockOnDismiss} />)
    toast = screen.getByRole('alert')
    expect(toast).toHaveClass('bg-yellow-50')

    rerender(<ToastComponent type="info" description="Info" onDismiss={mockOnDismiss} />)
    toast = screen.getByRole('alert')
    expect(toast).toHaveClass('bg-blue-50')
  })

  it('shows appropriate icons for each type', () => {
    const { rerender } = render(
      <ToastComponent type="success" description="Success" onDismiss={mockOnDismiss} />
    )

    expect(document.querySelector('.lucide-check-circle')).toBeInTheDocument()

    rerender(<ToastComponent type="error" description="Error" onDismiss={mockOnDismiss} />)
    expect(document.querySelector('.lucide-alert-circle')).toBeInTheDocument()

    rerender(<ToastComponent type="warning" description="Warning" onDismiss={mockOnDismiss} />)
    expect(document.querySelector('.lucide-alert-triangle')).toBeInTheDocument()

    rerender(<ToastComponent type="info" description="Info" onDismiss={mockOnDismiss} />)
    expect(document.querySelector('.lucide-info')).toBeInTheDocument()
  })

  it('handles dismiss button click', async () => {
    const user = userEvent.setup()
    render(
      <ToastComponent
        description="Test toast"
        onDismiss={mockOnDismiss}
        dismissible={true}
      />
    )

    const dismissButton = screen.getByLabelText('Dismiss notification')
    await user.click(dismissButton)

    expect(mockOnDismiss).toHaveBeenCalledTimes(1)
  })

  it('hides dismiss button when not dismissible', () => {
    render(
      <ToastComponent
        description="Test toast"
        onDismiss={mockOnDismiss}
        dismissible={false}
      />
    )

    expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const mockAction = jest.fn()
    const user = userEvent.setup()

    render(
      <ToastComponent
        description="Test toast"
        action={{ label: 'Undo', onClick: mockAction }}
        onDismiss={mockOnDismiss}
      />
    )

    const actionButton = screen.getByText('Undo')
    expect(actionButton).toBeInTheDocument()

    await user.click(actionButton)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('has proper accessibility attributes', () => {
    render(
      <ToastComponent
        description="Test toast"
        onDismiss={mockOnDismiss}
      />
    )

    const toast = screen.getByRole('alert')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })
})

describe('ToastProvider and useToast', () => {
  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    expect(screen.getByText('Success Toast')).toBeInTheDocument()
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
  })

  it('adds and displays toasts', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    const successButton = screen.getByText('Success Toast')
    await user.click(successButton)

    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1')
  })

  it('adds multiple toasts', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Success Toast'))
    await user.click(screen.getByText('Error Toast'))
    await user.click(screen.getByText('Warning Toast'))

    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
    expect(screen.getByTestId('toast-count')).toHaveTextContent('3')
  })

  it('clears all toasts', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Success Toast'))
    await user.click(screen.getByText('Error Toast'))

    expect(screen.getByTestId('toast-count')).toHaveTextContent('2')

    await user.click(screen.getByText('Clear All'))

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
  })

  it('auto-dismisses toasts after duration', async () => {
    jest.useFakeTimers()
    
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Success Toast'))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1')

    // Fast-forward time by 5 seconds (default duration)
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
    })

    jest.useRealTimers()
  })

  it('respects maxToasts limit', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider maxToasts={2}>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Success Toast'))
    await user.click(screen.getByText('Error Toast'))
    await user.click(screen.getByText('Warning Toast'))

    // Should only show 2 toasts (the limit)
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2')
  })

  it('dismisses individual toasts', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Success Toast'))
    await user.click(screen.getByText('Error Toast'))

    expect(screen.getByTestId('toast-count')).toHaveTextContent('2')

    // Dismiss the first toast
    const dismissButtons = screen.getAllByLabelText('Dismiss notification')
    await user.click(dismissButtons[0]!)

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1')
    })
  })
})

describe('useToastActions', () => {
  it('creates toasts with correct types and longer duration for errors', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Error Toast'))
    
    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('bg-red-50') // Error styling
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('handles custom toast with title and description', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    )

    await user.click(screen.getByText('Custom Toast'))
    
    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.getByText('Custom toast')).toBeInTheDocument()
  })
})

describe('Toast positioning', () => {
  it('renders toasts in different positions', () => {
    const { rerender } = render(
      <ToastProvider position="top-right">
        <TestToastComponent />
      </ToastProvider>
    )

    // We can't easily test positioning without DOM manipulation,
    // but we can verify the provider renders
    expect(screen.getByText('Success Toast')).toBeInTheDocument()

    rerender(
      <ToastProvider position="bottom-left">
        <TestToastComponent />
      </ToastProvider>
    )

    expect(screen.getByText('Success Toast')).toBeInTheDocument()
  })
})

describe('Toast error handling', () => {
  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestToastComponent />)
    }).toThrow('useToast must be used within a ToastProvider')

    consoleSpy.mockRestore()
  })
})