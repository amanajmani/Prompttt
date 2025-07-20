import { render, screen } from '@testing-library/react';
import { WorldClassAuthNav } from '../world-class-auth-nav';
import { WorldClassAuthProvider } from '../supabase-auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { AuthState } from '@/lib/auth';

// Mock the logout button component
jest.mock('../logout-button', () => ({
  LogoutButton: () => <button>Sign Out</button>,
}));

// Wrapper component for tests
function TestWrapper({ 
  children, 
  initialAuthState 
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
      )
    });

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(2);
  });

  it('renders authenticated state without flashing', () => {
    const authenticatedAuthState: AuthState = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      isLoading: false,
    };

    render(<WorldClassAuthNav />, { 
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={authenticatedAuthState}>
          {children}
        </TestWrapper>
      )
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
      )
    });

    // Should show sign in/up buttons
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    
    // Should not show welcome message or sign out
    expect(screen.queryByText('Welcome back!')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const authenticatedAuthState: AuthState = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      isLoading: false,
    };

    render(<WorldClassAuthNav />, { 
      wrapper: ({ children }) => (
        <TestWrapper initialAuthState={authenticatedAuthState}>
          {children}
        </TestWrapper>
      )
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
      )
    });

    // Check for proper link hrefs
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    
    expect(signInLink).toHaveAttribute('href', '/login');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});