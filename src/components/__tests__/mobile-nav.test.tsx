import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNav } from '../mobile-nav';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('MobileNav', () => {
  const mockChildren = (
    <div data-testid="nav-content">
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>
  );

  it('renders the menu button', () => {
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    expect(menuButton).toBeInTheDocument();
  });

  it('shows menu icon when closed', () => {
    render(<MobileNav>{mockChildren}</MobileNav>);

    // Menu icon should be visible (Lucide Menu component)
    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    expect(menuButton).toBeInTheDocument();
  });

  it('opens menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
  });

  it('shows close icon when menu is open', async () => {
    const user = userEvent.setup();
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    await user.click(menuButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Close mobile menu' })
      ).toBeInTheDocument();
    });
  });

  it('renders children content in the menu', async () => {
    const user = userEvent.setup();
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByTestId('nav-content')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  it('closes menu when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileNav>{mockChildren}</MobileNav>);

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close menu using the panel close button
    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu panel',
    });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes menu when backdrop is clicked', async () => {
    render(<MobileNav>{mockChildren}</MobileNav>);

    // Open menu
    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click backdrop
    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement;
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    const user = userEvent.setup();
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');

    await user.click(menuButton);

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-menu-title');
    });
  });

  it('applies custom className to menu button', () => {
    render(<MobileNav className="custom-class">{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    expect(menuButton).toHaveClass('custom-class');
  });

  it('hides on desktop screens', () => {
    render(<MobileNav>{mockChildren}</MobileNav>);

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' });
    expect(menuButton).toHaveClass('md:hidden');
  });
});
