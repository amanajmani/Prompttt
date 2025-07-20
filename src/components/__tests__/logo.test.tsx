import { render, screen } from '@testing-library/react';
import { Logo } from '../logo';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('Logo', () => {
  it('renders the PROMPTTT text', () => {
    render(<Logo />);

    expect(screen.getByText('PROMPTTT')).toBeInTheDocument();
  });

  it('links to the home page', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('has proper accessibility attributes', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'PROMPTTT - Home');
  });

  it('applies custom className when provided', () => {
    render(<Logo className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('has proper styling classes for typography and effects', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'items-center', 'text-xl', 'font-bold');
  });

  it('has proper focus states for accessibility', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring'
    );
  });

  it('has gradient text styling', () => {
    render(<Logo />);

    const textSpan = screen.getByText('PROMPTTT');
    expect(textSpan).toHaveClass(
      'bg-gradient-to-r',
      'from-primary',
      'bg-clip-text',
      'text-transparent'
    );
  });

  it('has hover effects', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:text-foreground/80');
  });
});
