import { render, screen } from '@testing-library/react';
import { WorldClassAuthNav } from '../world-class-auth-nav';
import { WorldClassAuthProvider } from '../supabase-auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { AuthState } from '@/lib/auth';
import type { User, Session } from '@supabase/supabase-js';

// Create a proper mock user for testing
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
  role: 'authenticated',
  updated_at: '2023-01-01T00:00:00.000Z',
  email_confirmed_at: '2023-01-01T00:00:00.000Z',
  last_sign_in_at: '2023-01-01T00:00:00.000Z',
  phone: undefined,
  confirmation_sent_at: undefined,
  confirmed_at: '2023-01-01T00:00:00.000Z',
  email_change_sent_at: undefined,
  new_email: undefined,
  invited_at: undefined,
  action_link: undefined,
  recovery_sent_at: undefined,
  phone_confirmed_at: undefined,
  new_phone: undefined,
  identities: [],
  factors: [],
  ...overrides,
});

// Create a proper mock session for testing
const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user,
});

// Mock the logout button component
jest.mock('../logout-button', () => ({
  LogoutButton: () => <button>Sign Out</button>,
}));

// Mock Supabase client creation to prevent env var issues in tests
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      }),
    },
  }),
}));

// Wrapper component for tests
function TestWrapper({
  children,
  initialAuthState,
}: {
  children: React.ReactNode;
  initialAuthState: AuthState;
}) {
  return (
    <ThemeProvider defaultTheme="light">
      <WorldClassAuthProvider initialAuthState={initialAuthState}>
        {children}
      </WorldClassAuthProvider>
    </ThemeProvider>
  );
}

describe('WorldClassAuthNav', () => {
  it('renders loading state correctly', () => {
    const loadingAuthState: AuthState = {
      user: null,
      session: null,
      isLoading: true,
    };

    render(<WorldClassAuthNav />, {
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={loadingAuthState}>
          {children}
        </TestWrapper>
      ),
    });

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(2);
  });

  it('renders authenticated state without flashing', () => {
    const mockUser = createMockUser();
    const authenticatedAuthState: AuthState = {
      user: mockUser,
      session: createMockSession(mockUser),
      isLoading: false,
    };

    render(<WorldClassAuthNav />, {
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={authenticatedAuthState}>
          {children}
        </TestWrapper>
      ),
    });

    // Should show welcome message and sign out button
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();

    // Should not show sign in/up buttons
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('renders unauthenticated state without flashing', () => {
    const unauthenticatedAuthState: AuthState = {
      user: null,
      session: null,
      isLoading: false,
    };

    render(<WorldClassAuthNav />, {
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={unauthenticatedAuthState}>
          {children}
        </TestWrapper>
      ),
    });

    // Should show sign in/up buttons
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Should not show welcome message or sign out
    expect(screen.queryByText('Welcome back!')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const mockUser = createMockUser();
    const authenticatedAuthState: AuthState = {
      user: mockUser,
      session: createMockSession(mockUser),
      isLoading: false,
    };

    render(<WorldClassAuthNav />, {
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={authenticatedAuthState}>
          {children}
        </TestWrapper>
      ),
    });

    // Check for proper button roles
    const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
    expect(signOutButton).toBeInTheDocument();
  });

  it('renders sign in and sign up links with proper hrefs', () => {
    const unauthenticatedAuthState: AuthState = {
      user: null,
      session: null,
      isLoading: false,
    };

    render(<WorldClassAuthNav />, {
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={unauthenticatedAuthState}>
          {children}
        </TestWrapper>
      ),
    });

    // Check for proper link hrefs
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(signInLink).toHaveAttribute('href', '/login');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});
