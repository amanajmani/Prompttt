import { render, screen } from '@testing-library/react';
import SignupPage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Supabase auth helpers
jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: () => ({
    auth: {
      signUp: jest.fn(),
    },
  }),
}));

describe('SignupPage', () => {
  it('renders all required form elements', () => {
    render(<SignupPage />);

    // Check for heading and description
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Join the community and start sharing your AI video art')).toBeInTheDocument();

    // Check for form inputs
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up with Google' })).toBeInTheDocument();

    // Check for login link
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('has correct input types', () => {
    render(<SignupPage />);

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('has required attributes on inputs', () => {
    render(<SignupPage />);

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(usernameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('disables submit button when fields are empty', () => {
    render(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButton).toBeDisabled();
  });

  it('has accessible labels for form inputs', () => {
    render(<SignupPage />);

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(usernameInput).toHaveAttribute('id', 'username');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  it('renders with correct structure', () => {
    const { container } = render(<SignupPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});