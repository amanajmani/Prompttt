import { render, screen } from '@testing-library/react';
import {
  ResponsiveContainer,
  ContainerQueryWrapper,
} from '../responsive-container';

describe('ResponsiveContainer', () => {
  it('renders children correctly', () => {
    render(
      <ResponsiveContainer>
        <div data-testid="child">Test content</div>
      </ResponsiveContainer>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies default size classes', () => {
    render(
      <ResponsiveContainer data-testid="container">
        <div>Content</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('mx-auto', 'w-full', '@container');
  });

  it('applies size-specific classes', () => {
    render(
      <ResponsiveContainer size="md" data-testid="container">
        <div>Content</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-md');
  });

  it('applies all size variants correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    const expectedClasses = [
      'max-w-sm',
      'max-w-md',
      'max-w-lg',
      'max-w-xl',
      'w-full',
    ];

    sizes.forEach((size, index) => {
      const { unmount } = render(
        <ResponsiveContainer size={size} data-testid={`container-${size}`}>
          <div>Content</div>
        </ResponsiveContainer>
      );

      const container = screen.getByTestId(`container-${size}`);
      expect(container).toHaveClass(expectedClasses[index]);

      unmount();
    });
  });

  it('disables container queries when specified', () => {
    render(
      <ResponsiveContainer
        enableContainerQueries={false}
        data-testid="container"
      >
        <div>Content</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).not.toHaveClass('@container');
  });

  it('merges custom className', () => {
    render(
      <ResponsiveContainer className="custom-class" data-testid="container">
        <div>Content</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('custom-class', 'mx-auto', 'w-full');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };

    render(
      <ResponsiveContainer ref={ref}>
        <div>Content</div>
      </ResponsiveContainer>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through HTML attributes', () => {
    render(
      <ResponsiveContainer
        data-testid="container"
        role="region"
        aria-label="Responsive content area"
      >
        <div>Content</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Responsive content area');
  });
});

describe('ContainerQueryWrapper', () => {
  it('renders children correctly', () => {
    render(
      <ContainerQueryWrapper>
        <div data-testid="child">Test content</div>
      </ContainerQueryWrapper>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies container query class', () => {
    render(
      <ContainerQueryWrapper data-testid="wrapper">
        <div>Content</div>
      </ContainerQueryWrapper>
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toHaveClass('@container');
  });

  it('merges custom className with container class', () => {
    render(
      <ContainerQueryWrapper className="custom-wrapper" data-testid="wrapper">
        <div>Content</div>
      </ContainerQueryWrapper>
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toHaveClass('@container', 'custom-wrapper');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };

    render(
      <ContainerQueryWrapper ref={ref}>
        <div>Content</div>
      </ContainerQueryWrapper>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
