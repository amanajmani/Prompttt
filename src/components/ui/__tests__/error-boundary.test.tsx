import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Custom fallback component for testing
const CustomFallback = ({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) => (
  <div>
    <p>Custom error: {error.message}</p>
    <button onClick={resetError}>Custom Reset</button>
  </div>
);

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children correctly when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/An error occurred while rendering this component/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument();
  });

  it('renders custom fallback component when provided', () => {
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Custom Reset' })
    ).toBeInTheDocument();
  });

  it('resets error state when reset button is clicked', () => {
    let shouldThrow = true;
    let resetKey = 0;

    const DynamicError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    const { rerender } = render(
      <ErrorBoundary resetKeys={[resetKey]}>
        <DynamicError />
      </ErrorBoundary>
    );

    // Error boundary should show fallback
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Change the throwing state and reset key to trigger reset
    shouldThrow = false;
    resetKey = 1;

    // Re-render with non-throwing component and new reset key
    rerender(
      <ErrorBoundary resetKeys={[resetKey]}>
        <DynamicError />
      </ErrorBoundary>
    );

    // Should show normal content again
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('logs error information when error is caught', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('handles multiple error and reset cycles', () => {
    let shouldThrow = true;
    let resetKey = 0;

    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Toggle error');
      }
      return <div>No error after reset</div>;
    };

    const { rerender } = render(
      <ErrorBoundary resetKeys={[resetKey]}>
        <ToggleError />
      </ErrorBoundary>
    );

    // First error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Reset
    shouldThrow = false;
    resetKey = 1;

    rerender(
      <ErrorBoundary resetKeys={[resetKey]}>
        <ToggleError />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error after reset')).toBeInTheDocument();

    // Cause another error
    shouldThrow = true;
    resetKey = 2;

    rerender(
      <ErrorBoundary resetKeys={[resetKey]}>
        <ToggleError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('applies correct styling classes to default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const container = screen.getByText('Something went wrong').closest('div');
    expect(container).toHaveClass('border-destructive/50');
    expect(container).toHaveClass('bg-destructive/10');
    expect(container).toHaveClass('rounded-lg');
  });
});
