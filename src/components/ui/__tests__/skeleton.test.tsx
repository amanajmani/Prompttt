import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders a div element', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');
  });

  it('applies base animation and background classes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-md');
    expect(skeleton).toHaveClass('bg-muted');
  });

  it('applies custom classes via className prop', () => {
    render(
      <Skeleton data-testid="skeleton" className="custom-class h-4 w-32" />
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveClass('h-4');
    expect(skeleton).toHaveClass('w-32');
    expect(skeleton).toHaveClass('custom-class');
    expect(skeleton).toHaveClass('animate-pulse'); // Still has base classes
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts all standard div props', () => {
    render(
      <Skeleton
        data-testid="skeleton"
        id="test-skeleton"
        role="presentation"
        aria-label="Loading content"
      />
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveAttribute('id', 'test-skeleton');
    expect(skeleton).toHaveAttribute('role', 'presentation');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
  });

  it('can be customized for different shapes and sizes', () => {
    const { rerender } = render(
      <Skeleton data-testid="skeleton" className="h-4 w-full" />
    );
    expect(screen.getByTestId('skeleton')).toHaveClass('h-4', 'w-full');

    // Circular avatar skeleton
    rerender(
      <Skeleton data-testid="skeleton" className="h-12 w-12 rounded-full" />
    );
    expect(screen.getByTestId('skeleton')).toHaveClass(
      'h-12',
      'w-12',
      'rounded-full'
    );

    // Text line skeleton
    rerender(<Skeleton data-testid="skeleton" className="h-3 w-3/4" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-3', 'w-3/4');
  });

  it('renders children when provided', () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Loading content</span>
      </Skeleton>
    );

    expect(screen.getByText('Loading content')).toBeInTheDocument();
  });

  it('can be used for complex loading layouts', () => {
    render(
      <div data-testid="loading-card">
        <Skeleton className="mb-4 h-48 w-full" /> {/* Image placeholder */}
        <Skeleton className="mb-2 h-6 w-3/4" /> {/* Title placeholder */}
        <Skeleton className="mb-1 h-4 w-full" /> {/* Line 1 */}
        <Skeleton className="h-4 w-2/3" /> {/* Line 2 */}
      </div>
    );

    const loadingCard = screen.getByTestId('loading-card');
    const skeletons = loadingCard.querySelectorAll('.animate-pulse');

    expect(skeletons).toHaveLength(4);
    expect(skeletons[0]).toHaveClass('h-48', 'w-full');
    expect(skeletons[1]).toHaveClass('h-6', 'w-3/4');
    expect(skeletons[2]).toHaveClass('h-4', 'w-full');
    expect(skeletons[3]).toHaveClass('h-4', 'w-2/3');
  });
});
