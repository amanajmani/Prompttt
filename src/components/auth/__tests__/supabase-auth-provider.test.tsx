import { render, screen, act } from '@testing-library/react';
import { SupabaseAuthProvider } from '../supabase-auth-provider';

// Mock Supabase auth helpers
const mockCreateClientComponentClient = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockCreateClientComponentClient(),
}));

jest.mock('@supabase/auth-helpers-react', () => ({
  SessionContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

describe('SupabaseAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClientComponentClient.mockReturnValue({
      auth: { getSession: jest.fn() },
    });
  });

  it('renders children without session provider initially', () => {
    render(
      <SupabaseAuthProvider>
        <div data-testid="test-child">Test Content</div>
      </SupabaseAuthProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('initializes Supabase client on mount', async () => {
    render(
      <SupabaseAuthProvider>
        <div data-testid="test-child">Test Content</div>
      </SupabaseAuthProvider>
    );

    // Wait for useEffect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockCreateClientComponentClient).toHaveBeenCalledTimes(1);
  });

  it('provides session context after initialization', async () => {
    render(
      <SupabaseAuthProvider>
        <div data-testid="test-child">Test Content</div>
      </SupabaseAuthProvider>
    );

    // Wait for initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After initialization, should render with session provider
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('maintains client instance across renders', async () => {
    // Reset mock to ensure clean state
    mockCreateClientComponentClient.mockClear();

    const { rerender } = render(
      <SupabaseAuthProvider>
        <div data-testid="test-child">Test Content</div>
      </SupabaseAuthProvider>
    );

    // Wait for initial initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Record the call count after initial render
    const initialCallCount = mockCreateClientComponentClient.mock.calls.length;

    // Rerender the component with different children
    rerender(
      <SupabaseAuthProvider>
        <div data-testid="test-child-updated">Updated Content</div>
      </SupabaseAuthProvider>
    );

    // Should not have additional calls beyond the initial render
    expect(mockCreateClientComponentClient).toHaveBeenCalledTimes(
      initialCallCount
    );
    expect(screen.getByTestId('test-child-updated')).toBeInTheDocument();
  });
});
