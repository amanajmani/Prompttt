import { render, screen } from '@testing-library/react';
import { Grid } from '../grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div data-testid="grid-item-1">Item 1</div>
        <div data-testid="grid-item-2">Item 2</div>
      </Grid>
    );

    expect(screen.getByTestId('grid-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-2')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    render(
      <Grid data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-4');
  });

  it('applies numeric column configuration', () => {
    render(
      <Grid cols={3} data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid-cols-3');
  });

  it('applies responsive column configuration', () => {
    render(
      <Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4'
    );
  });

  it('applies numeric gap configuration', () => {
    render(
      <Grid gap={6} data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-6');
  });

  it('applies responsive gap configuration', () => {
    render(
      <Grid gap={{ sm: 2, md: 4, lg: 6 }} data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-2', 'md:gap-4', 'lg:gap-6');
  });

  it('merges custom className with grid classes', () => {
    render(
      <Grid className="custom-class" data-testid="grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };

    render(
      <Grid ref={ref}>
        <div>Item</div>
      </Grid>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional HTML attributes', () => {
    render(
      <Grid data-testid="grid" role="grid" aria-label="Video grid">
        <div>Item</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveAttribute('role', 'grid');
    expect(grid).toHaveAttribute('aria-label', 'Video grid');
  });
});
