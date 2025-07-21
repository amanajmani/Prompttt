import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientLogoutButton } from '../client-logout-button';
import { SupabaseAuthProvider } from '../supabase-auth-provider';
import { ThemeProvider } from '@/components/theme-provider';

// Mock Supabase client and auth hooks
const mockSignOut = jest.fn();
const mockUseUser = jest.fn();
const mockCreateClientComponentClient = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockCreateClientComponentClient(),
}));

jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
  useUser: () => mockUseUser(),
  useSession: () => null,
  SessionContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-context-provider">{children}</div>
  ),
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
    </ThemeProvider>
  );
}

describe('ClientLogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
    // Set up default user state for tests
    mockUseUser.mockReturnValue({
      id: 'test-user-id',
      email: 'test@example.com',
    });
    // Set up Supabase client mock
    mockCreateClientComponentClient.mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  it('renders logout button correctly', () => {
    render(<ClientLogoutButton />, { wrapper: TestWrapper });

    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when signing out', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ClientLogoutButton />, { wrapper: TestWrapper });

    const button = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(button);

    expect(screen.getByText('Signing out...')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('calls signOut and redirects on successful logout', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    render(<ClientLogoutButton />, { wrapper: TestWrapper });

    const button = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/');
    });
  });

  it('handles logout error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    mockSignOut.mockResolvedValue({ error: { message: 'Logout failed' } });

    render(<ClientLogoutButton />, { wrapper: TestWrapper });

    const button = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    expect(consoleError).toHaveBeenCalledWith('Error signing out:', {
      message: 'Logout failed',
    });
    expect(window.location.href).toBe(''); // Should not redirect on error

    consoleError.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(<ClientLogoutButton />, { wrapper: TestWrapper });

    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();

    // Check for icon
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
