import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TouchOptimizedButton } from '../touch-optimized-button';

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true,
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
});

describe('TouchOptimizedButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(1000);
  });

  it('renders children correctly', () => {
    render(<TouchOptimizedButton>Click me</TouchOptimizedButton>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies touch-optimized classes', () => {
    render(
      <TouchOptimizedButton data-testid="touch-button">
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByTestId('touch-button');
    expect(button).toHaveClass(
      'min-h-[44px]',
      'min-w-[44px]',
      'touch-manipulation',
      'select-none'
    );
  });

  it('handles click events', () => {
    const handleClick = jest.fn();

    render(
      <TouchOptimizedButton onClick={handleClick}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents double clicks when enabled', () => {
    const handleClick = jest.fn();

    render(
      <TouchOptimizedButton onClick={handleClick} preventDoubleClick={true}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');

    // Simulate rapid clicks
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('allows multiple clicks when double-click prevention is disabled', () => {
    const handleClick = jest.fn();

    render(
      <TouchOptimizedButton onClick={handleClick} preventDoubleClick={false}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('triggers haptic feedback on touch start', () => {
    render(
      <TouchOptimizedButton hapticFeedback={true}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');
    fireEvent.touchStart(button);

    expect(navigator.vibrate).toHaveBeenCalledWith(10);
  });

  it('does not trigger haptic feedback when disabled', () => {
    render(
      <TouchOptimizedButton hapticFeedback={false}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');
    fireEvent.touchStart(button);

    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it('handles touch delay correctly', async () => {
    const handleClick = jest.fn();

    render(
      <TouchOptimizedButton onClick={handleClick} touchDelay={100}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    // Should not be called immediately
    expect(handleClick).not.toHaveBeenCalled();

    // Should be called after delay
    await waitFor(
      () => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );
  });

  it('shows processing state during touch delay', async () => {
    render(
      <TouchOptimizedButton touchDelay={100} data-testid="touch-button">
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByTestId('touch-button');
    fireEvent.click(button);

    // Should show processing state
    expect(button).toHaveClass('opacity-70', 'cursor-wait');
    expect(button).toBeDisabled();

    // Should return to normal after delay
    await waitFor(
      () => {
        expect(button).not.toHaveClass('opacity-70', 'cursor-wait');
        expect(button).not.toBeDisabled();
      },
      { timeout: 200 }
    );
  });

  it('applies pressed state on touch', () => {
    render(
      <TouchOptimizedButton data-testid="touch-button">
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByTestId('touch-button');

    fireEvent.touchStart(button);
    expect(button).toHaveClass('scale-95', 'brightness-90');

    fireEvent.touchEnd(button);
    expect(button).not.toHaveClass('scale-95', 'brightness-90');
  });

  it('respects disabled state', () => {
    const handleClick = jest.fn();

    render(
      <TouchOptimizedButton onClick={handleClick} disabled={true}>
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('merges custom className', () => {
    render(
      <TouchOptimizedButton className="custom-class" data-testid="touch-button">
        Click me
      </TouchOptimizedButton>
    );

    const button = screen.getByTestId('touch-button');
    expect(button).toHaveClass('custom-class', 'min-h-[44px]');
  });
});
