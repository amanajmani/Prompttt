import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and not clickable when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct CSS classes for default variant and size', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('min-h-[44px]');
  });

  it('applies correct CSS classes for destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('applies correct CSS classes for outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');
  });

  it('applies correct CSS classes for secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('applies correct CSS classes for ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('hover:text-accent-foreground');
  });

  it('applies correct CSS classes for small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  it('applies correct CSS classes for large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('min-h-[44px]');
  });

  it('applies correct CSS classes for icon size', () => {
    render(<Button size="icon">X</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('w-11');
    expect(button).toHaveClass('min-h-[44px]');
    expect(button).toHaveClass('min-w-[44px]');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary'); // Still has default classes
  });

  it('has accessible focus styles', () => {
    render(<Button>Focusable Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('focus-visible:outline-none');
    expect(button).toHaveClass('focus-visible:ring-2');
    expect(button).toHaveClass('focus-visible:ring-ring');
  });

  it('renders with correct structure and classes', () => {
    const { container } = render(<Button>Test Button</Button>);
    const button = container.firstChild as HTMLElement;
    
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    expect(button).toHaveTextContent('Test Button');
  });

  it('renders all variants with correct styling', () => {
    const variants = [
      { variant: 'default' as const, expectedClass: 'bg-primary' },
      { variant: 'destructive' as const, expectedClass: 'bg-destructive' },
      { variant: 'outline' as const, expectedClass: 'border-input' },
      { variant: 'secondary' as const, expectedClass: 'bg-secondary' },
      { variant: 'ghost' as const, expectedClass: 'hover:bg-accent' },
    ];
    
    variants.forEach(({ variant, expectedClass }) => {
      const { container } = render(<Button variant={variant}>{variant}</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button).toHaveClass(expectedClass);
    });
  });

  it('renders all sizes with correct dimensions', () => {
    const sizes = [
      { size: 'default' as const, expectedClass: 'h-11' },
      { size: 'sm' as const, expectedClass: 'h-9' },
      { size: 'lg' as const, expectedClass: 'h-12' },
      { size: 'icon' as const, expectedClass: 'w-11' },
    ];
    
    sizes.forEach(({ size, expectedClass }) => {
      const { container } = render(<Button size={size}>{size}</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button).toHaveClass(expectedClass);
    });
  });
});
