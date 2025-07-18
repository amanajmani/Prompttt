import { render, screen } from '@testing-library/react';
import { Container } from '../container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="test-child">Test content</div>
      </Container>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default responsive classes', () => {
    const { container } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('mx-auto');
    expect(containerDiv).toHaveClass('max-w-7xl');
    expect(containerDiv).toHaveClass('px-4');
    expect(containerDiv).toHaveClass('sm:px-6');
    expect(containerDiv).toHaveClass('md:px-8');
    expect(containerDiv).toHaveClass('lg:px-12');
  });

  it('accepts and merges custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Test content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('custom-class');
    expect(containerDiv).toHaveClass('mx-auto'); // Still has default classes
  });

  it('renders as a div element', () => {
    const { container } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
