import { render, screen, waitFor } from '@testing-library/react';
import { ThemeAwareImage } from '../theme-aware-image';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    priority,
    sizes,
    placeholder,
    blurDataURL,
    ...props
  }: any) {
    // Only pass DOM-compatible props to img element
    const domProps: any = {
      src,
      alt: alt || '',
      'data-testid': 'theme-aware-image',
      // Pass through other DOM-compatible props
      className: props.className,
      style: props.style,
      onClick: props.onClick,
      onLoad: props.onLoad,
      onError: props.onError,
    };

    // Add Next.js specific props as data attributes for testing
    if (fill) domProps['data-fill'] = 'true';
    if (priority) domProps['data-priority'] = 'true';
    if (sizes) domProps['data-sizes'] = sizes;
    if (placeholder) domProps['data-placeholder'] = placeholder;
    if (blurDataURL) domProps['data-blur-data-url'] = blurDataURL;

    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...domProps} />;
  };
});

// Mock the theme provider
const mockUseTheme = jest.fn();
jest.mock('../theme-provider', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeAwareImage', () => {
  const defaultProps = {
    lightSrc: '/images/logo-light.png',
    darkSrc: '/images/logo-dark.png',
    alt: 'Company Logo',
    width: 200,
    height: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders light image when theme is light', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    // Act
    render(<ThemeAwareImage {...defaultProps} />);

    // Assert
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/logo-light.png');
      expect(image).toHaveAttribute('alt', 'Company Logo');
    });
  });

  it('renders dark image when theme is dark', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
    });

    // Act
    render(<ThemeAwareImage {...defaultProps} />);

    // Assert
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/logo-dark.png');
      expect(image).toHaveAttribute('alt', 'Company Logo');
    });
  });

  it('renders placeholder when theme is not resolved', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: undefined,
    });

    // Act
    render(<ThemeAwareImage {...defaultProps} />);

    // Assert
    expect(screen.queryByTestId('theme-aware-image')).not.toBeInTheDocument();

    // Should render a placeholder div
    const placeholder = screen.getByRole('presentation', { hidden: true });
    expect(placeholder).toBeInTheDocument();
  });

  it('passes through additional props to Image component', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    // Act
    render(
      <ThemeAwareImage
        {...defaultProps}
        className="custom-class"
        priority={true}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    // Assert
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toHaveClass('custom-class');
      expect(image).toHaveAttribute('data-priority', 'true');
      expect(image).toHaveAttribute(
        'data-sizes',
        '(max-width: 768px) 100vw, 50vw'
      );
    });
  });

  it('handles fill prop correctly', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    // Act
    render(
      <ThemeAwareImage
        lightSrc="/light.png"
        darkSrc="/dark.png"
        alt="Test"
        fill={true}
      />
    );

    // Assert
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toHaveAttribute('data-fill', 'true');
      expect(image).not.toHaveAttribute('width');
      expect(image).not.toHaveAttribute('height');
    });
  });

  it('defaults to light image when resolvedTheme is system or unknown', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'system',
    });

    // Act
    render(<ThemeAwareImage {...defaultProps} />);

    // Assert
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toHaveAttribute('src', '/images/logo-light.png');
    });
  });

  it('updates image source when theme changes', async () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    const { rerender } = render(<ThemeAwareImage {...defaultProps} />);

    // Assert initial state
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toHaveAttribute('src', '/images/logo-light.png');
    });

    // Act - change theme
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
    });

    rerender(<ThemeAwareImage {...defaultProps} />);

    // Assert updated state
    await waitFor(() => {
      const image = screen.getByTestId('theme-aware-image');
      expect(image).toHaveAttribute('src', '/images/logo-dark.png');
    });
  });
});
