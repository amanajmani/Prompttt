import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../theme-provider';

// Mock next-themes
const mockSetTheme = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
  useTheme: () => mockUseTheme(),
}));

// Test component that uses the theme hook
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
    });
  });

  it('renders next-themes provider wrapper', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
  });

  it('provides theme context through useTheme hook', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
  });

  it('allows theme switching through setTheme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    screen.getByTestId('set-dark').click();
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('handles light theme selection', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    screen.getByTestId('set-light').click();
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('handles system theme selection', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    screen.getByTestId('set-system').click();
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('works with dark resolved theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });
});
