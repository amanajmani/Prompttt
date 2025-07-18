import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <div data-testid="card-child">Card content</div>
        </Card>
      );

      expect(screen.getByTestId('card-child')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies default CSS classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('text-card-foreground');
      expect(card).toHaveClass('shadow-sm');
    });

    it('accepts and applies custom className', () => {
      const { container } = render(
        <Card className="custom-card-class">Content</Card>
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('custom-card-class');
      expect(card).toHaveClass('rounded-lg'); // Still has default classes
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('renders children correctly', () => {
      render(
        <CardHeader>
          <div data-testid="header-child">Header content</div>
        </CardHeader>
      );

      expect(screen.getByTestId('header-child')).toBeInTheDocument();
    });

    it('applies default CSS classes', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild as HTMLElement;

      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('space-y-1.5');
      expect(header).toHaveClass('p-6');
    });

    it('accepts custom className', () => {
      const { container } = render(
        <CardHeader className="custom-header">Header</CardHeader>
      );
      const header = container.firstChild as HTMLElement;

      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('flex'); // Still has default classes
    });
  });

  describe('CardTitle', () => {
    it('renders as h2 element with correct content', () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Card Title');
    });

    it('applies default CSS classes', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 2 });

      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('leading-none');
      expect(title).toHaveClass('tracking-tight');
    });

    it('accepts custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 2 });

      expect(title).toHaveClass('custom-title');
      expect(title).toHaveClass('text-2xl'); // Still has default classes
    });
  });

  describe('CardDescription', () => {
    it('renders as p element with correct content', () => {
      render(<CardDescription>Card description text</CardDescription>);

      const description = screen.getByText('Card description text');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('applies default CSS classes', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');

      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-muted-foreground');
    });

    it('accepts custom className', () => {
      render(
        <CardDescription className="custom-desc">Description</CardDescription>
      );
      const description = screen.getByText('Description');

      expect(description).toHaveClass('custom-desc');
      expect(description).toHaveClass('text-sm'); // Still has default classes
    });
  });

  describe('CardContent', () => {
    it('renders children correctly', () => {
      render(
        <CardContent>
          <div data-testid="content-child">Main content</div>
        </CardContent>
      );

      expect(screen.getByTestId('content-child')).toBeInTheDocument();
    });

    it('applies default CSS classes', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;

      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('pt-0');
    });

    it('accepts custom className', () => {
      const { container } = render(
        <CardContent className="custom-content">Content</CardContent>
      );
      const content = container.firstChild as HTMLElement;

      expect(content).toHaveClass('custom-content');
      expect(content).toHaveClass('p-6'); // Still has default classes
    });
  });

  describe('CardFooter', () => {
    it('renders children correctly', () => {
      render(
        <CardFooter>
          <div data-testid="footer-child">Footer content</div>
        </CardFooter>
      );

      expect(screen.getByTestId('footer-child')).toBeInTheDocument();
    });

    it('applies default CSS classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;

      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('items-center');
      expect(footer).toHaveClass('p-6');
      expect(footer).toHaveClass('pt-0');
    });

    it('accepts custom className', () => {
      const { container } = render(
        <CardFooter className="custom-footer">Footer</CardFooter>
      );
      const footer = container.firstChild as HTMLElement;

      expect(footer).toHaveClass('custom-footer');
      expect(footer).toHaveClass('flex'); // Still has default classes
    });
  });

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>Test card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Test Card Title'
      );
      expect(screen.getByText('Test card description')).toBeInTheDocument();
      expect(
        screen.getByText('Main card content goes here')
      ).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Action Button');
    });
  });
});
