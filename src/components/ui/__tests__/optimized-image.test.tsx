import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OptimizedImage } from '../optimized-image';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ onLoad, onError, alt, ...props }: any) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={alt || 'Test image'}
        onLoad={() => onLoad?.()}
        onError={() => onError?.()}
        data-testid="next-image"
      />
    );
  };
});

describe('OptimizedImage', () => {
  it('renders image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
    expect(image).toHaveAttribute('width', '400');
    expect(image).toHaveAttribute('height', '300');
  });

  it('shows loading placeholder initially', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('hides placeholder after image loads', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.load(image);

    await waitFor(() => {
      const placeholder = document.querySelector('.animate-pulse');
      expect(placeholder).not.toBeInTheDocument();
    });
  });

  it('calls onLoadComplete when image loads', async () => {
    const onLoadComplete = jest.fn();

    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        onLoadComplete={onLoadComplete}
      />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.load(image);

    await waitFor(() => {
      expect(onLoadComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('shows fallback image on error', async () => {
    render(
      <OptimizedImage
        src="/broken-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        fallbackSrc="/fallback-image.jpg"
      />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/fallback-image.jpg');
    });
  });

  it('shows error state when no fallback provided', async () => {
    render(
      <OptimizedImage
        src="/broken-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    await waitFor(() => {
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });

  it('calls onError when image fails to load', async () => {
    const onError = jest.fn();

    render(
      <OptimizedImage
        src="/broken-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        onError={onError}
      />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('can disable placeholder', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        showPlaceholder={false}
      />
    );

    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        className="custom-image-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-image-class');
  });

  it('applies custom placeholder className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        placeholderClassName="custom-placeholder"
      />
    );

    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).toHaveClass('custom-placeholder');
  });
});
