import { render, screen } from '@testing-library/react';
import LoginPage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('LoginPage', () => {
  it('renders all required form elements', () => {
    render(<LoginPage />);

    // Check for heading and description
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();

    // Check for form inputs
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In with Google' })).toBeInTheDocument();

    // Check for signup link
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('has correct input types', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('has required attributes on inputs', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('disables submit button when fields are empty', () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    expect(submitButton).toBeDisabled();
  });

  it('has accessible labels for form inputs', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  it('renders with correct structure', () => {
    const { container } = render(<LoginPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});