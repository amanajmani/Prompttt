import { render, screen } from '@testing-library/react';
import PerformanceBudget from './performance-budget';

// Mock performance API
const mockPerformanceEntry = {
  fetchStart: 0,
  loadEventEnd: 1000,
  domContentLoadedEventEnd: 800,
} as PerformanceNavigationTiming;

Object.defineProperty(window, 'performance', {
  value: {
    getEntriesByType: jest.fn(() => [mockPerformanceEntry]),
  },
  writable: true,
});

describe('PerformanceBudget', () => {
  beforeEach(() => {
    // Mock environment for testing
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });
  });

  it('renders performance metrics in development', () => {
    render(<PerformanceBudget showInDevelopment={true} />);

    // Should show performance budget card
    expect(screen.getByText('Performance Budget')).toBeInTheDocument();
  });

  it('does not render in production by default', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });

    render(<PerformanceBudget />);

    // Should not show performance budget card
    expect(screen.queryByText('Performance Budget')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PerformanceBudget className="custom-class" showInDevelopment={true} />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles missing performance data gracefully', () => {
    // Mock empty performance entries
    window.performance.getEntriesByType = jest.fn(() => []);

    render(<PerformanceBudget showInDevelopment={true} />);

    // Should not crash and not show the component
    expect(screen.queryByText('Performance Budget')).not.toBeInTheDocument();
  });
});
