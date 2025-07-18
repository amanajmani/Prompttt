import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';

describe('Input', () => {
  it('calls onChange handler correctly when user types', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'test input' }),
      })
    );
  });

  it('is correctly disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('applies correct CSS classes for default state', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('flex');
    expect(input).toHaveClass('h-11');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('border-input');
    expect(input).toHaveClass('bg-background');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
    expect(input).toHaveClass('text-sm');
  });

  it('applies correct CSS classes for focus state', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('focus-visible:outline-none');
    expect(input).toHaveClass('focus-visible:ring-2');
    expect(input).toHaveClass('focus-visible:ring-ring');
    expect(input).toHaveClass('focus-visible:ring-offset-2');
  });

  it('applies placeholder styles correctly', () => {
    render(<Input placeholder="Enter text..." />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('placeholder:text-muted-foreground');
    expect(input).toHaveAttribute('placeholder', 'Enter text...');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('h-11'); // Still has default classes
  });

  it('accepts all standard input props', () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="email"
        value="test@example.com"
        onChange={handleChange}
        placeholder="Email address"
        required
        data-testid="email-input"
      />
    );

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('value', 'test@example.com');
    expect(input).toHaveAttribute('placeholder', 'Email address');
    expect(input).toHaveAttribute('required');
  });

  it('handles different input types correctly', () => {
    const { rerender } = render(
      <Input type="password" data-testid="test-input" />
    );
    expect(screen.getByTestId('test-input')).toHaveAttribute(
      'type',
      'password'
    );

    rerender(<Input type="email" data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'number');
  });

  it('supports controlled input', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Input value="initial" onChange={handleChange} />
    );

    expect(screen.getByRole('textbox')).toHaveValue('initial');

    rerender(<Input value="updated" onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('updated');
  });

  it('supports uncontrolled input', () => {
    render(<Input defaultValue="default text" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('default text');

    fireEvent.change(input, { target: { value: 'new text' } });
    expect(input).toHaveValue('new text');
  });
});
