import { render, screen } from '@testing-library/react';
import { DesktopNav } from '../desktop-nav';

// Mock Next.js hooks and components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = require('next/navigation').usePathname;

describe('DesktopNav', () => {
  const mockItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://external.com', label: 'External', external: true },
  ];

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(<DesktopNav items={mockItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('External')).toBeInTheDocument();
  });

  it('renders as a semantic nav element', () => {
    render(<DesktopNav items={mockItems} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('highlights active navigation item', () => {
    mockUsePathname.mockReturnValue('/about');
    render(<DesktopNav items={mockItems} />);

    const aboutLink = screen.getByText('About');
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
    expect(aboutLink).toHaveClass('text-foreground');
  });

  it('applies inactive styling to non-active items', () => {
    mockUsePathname.mockReturnValue('/about');
    render(<DesktopNav items={mockItems} />);

    const homeLink = screen.getByText('Home');
    expect(homeLink).not.toHaveAttribute('aria-current');
    expect(homeLink).toHaveClass('text-foreground/60');
  });

  it('handles external links correctly', () => {
    render(<DesktopNav items={mockItems} />);

    const externalLink = screen.getByText('External');
    expect(externalLink).toHaveAttribute('href', 'https://external.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add external attributes to internal links', () => {
    render(<DesktopNav items={mockItems} />);

    const homeLink = screen.getByText('Home');
    expect(homeLink).not.toHaveAttribute('target');
    expect(homeLink).not.toHaveAttribute('rel');
  });

  it('has proper accessibility attributes', () => {
    render(<DesktopNav items={mockItems} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring'
      );
    });
  });

  it('applies custom className when provided', () => {
    render(<DesktopNav items={mockItems} className="custom-class" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('is hidden on mobile screens', () => {
    render(<DesktopNav items={mockItems} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden', 'md:flex');
  });

  it('has proper hover and transition classes', () => {
    render(<DesktopNav items={mockItems} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('transition-colors', 'hover:text-foreground/80');
    });
  });

  it('handles empty items array', () => {
    render(<DesktopNav items={[]} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('updates active state when pathname changes', () => {
    const { rerender } = render(<DesktopNav items={mockItems} />);

    // Initially home is active
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');

    // Change pathname
    mockUsePathname.mockReturnValue('/contact');
    rerender(<DesktopNav items={mockItems} />);

    // Now contact should be active
    expect(screen.getByText('Contact')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Home')).not.toHaveAttribute('aria-current');
  });
});
