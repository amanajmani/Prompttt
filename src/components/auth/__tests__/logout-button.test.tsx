import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogoutButton } from '../logout-button';

// Mock Next.js router
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock Supabase auth helpers
const mockSignOut = jest.fn();
const mockUseUser = jest.fn();
const mockUseSupabaseClient = jest.fn();

jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: () => mockUseSupabaseClient(),
  useUser: () => mockUseUser(),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSupabaseClient.mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  it('renders when user is authenticated', () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });

    render(<LogoutButton />);

    expect(
      screen.getByRole('button', { name: 'Sign Out' })
    ).toBeInTheDocument();
  });

  it('does not render when user is not authenticated', () => {
    mockUseUser.mockReturnValue(null);

    render(<LogoutButton />);

    expect(
      screen.queryByRole('button', { name: 'Sign Out' })
    ).not.toBeInTheDocument();
  });

  it('calls signOut when clicked', async () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });
    mockSignOut.mockResolvedValue({ error: null });

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  it('redirects to homepage after successful logout', async () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });
    mockSignOut.mockResolvedValue({ error: null });

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('shows loading state when signing out', async () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });
    mockSignOut.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(logoutButton);

    expect(
      screen.getByRole('button', { name: 'Signing out...' })
    ).toBeInTheDocument();
    expect(logoutButton).toBeDisabled();
  });

  it('handles logout errors gracefully', async () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });
    mockSignOut.mockResolvedValue({ error: { message: 'Logout failed' } });
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', {
        message: 'Logout failed',
      });
    });

    // Should not redirect on error - the early return prevents router.push
    expect(mockPush).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('applies custom props correctly', () => {
    mockUseUser.mockReturnValue({ id: 'test-user-id' });

    render(
      <LogoutButton variant="destructive" size="sm" className="custom-class" />
    );

    const logoutButton = screen.getByRole('button', { name: 'Sign Out' });
    expect(logoutButton).toHaveClass('custom-class');
  });
});
