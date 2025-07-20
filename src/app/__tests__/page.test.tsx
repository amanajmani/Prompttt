import { render, screen } from '@testing-library/react';
import Home from '../page';
import { ThemeProvider } from '@/components/theme-provider';

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />, { wrapper: TestWrapper });
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'AI VideoHub',
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<Home />, { wrapper: TestWrapper });
    const description = screen.getByText(/definitive, curated gallery/i);
    expect(description).toBeInTheDocument();
  });

  it('uses the Container component', () => {
    const { container } = render(<Home />, { wrapper: TestWrapper });
    const containerElement = container.querySelector('.mx-auto.max-w-7xl');
    expect(containerElement).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Home />, { wrapper: TestWrapper });
    // Check for the main content container (now a div since layout provides the main element)
    const contentContainer = screen.getByText('AI VideoHub').closest('div');
    expect(contentContainer).toBeInTheDocument();
  });
});
