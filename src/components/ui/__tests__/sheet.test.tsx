import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from '@/components/ui';

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}

describe('Sheet Component System', () => {
  it('renders the sheet trigger button', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
            <SheetDescription>Test sheet description</SheetDescription>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    expect(trigger).toBeInTheDocument();
  });

  it('is initially hidden', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
            <SheetDescription>Test sheet description</SheetDescription>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    // Sheet content should not be visible initially
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
  });

  it('becomes visible when trigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
            <SheetDescription>Test sheet description</SheetDescription>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    fireEvent.click(trigger);

    // Sheet content should now be visible
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
    expect(screen.getByText('Test Sheet')).toBeInTheDocument();
  });

  it('renders with correct side variant', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent side="left" data-testid="sheet-content">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>Left sheet description</SheetDescription>
          </SheetHeader>
          <p>Left side content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    fireEvent.click(trigger);

    const sheetContent = screen.getByTestId('sheet-content');
    expect(sheetContent).toHaveClass('inset-y-0', 'left-0');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Accessible Sheet</SheetTitle>
            <SheetDescription>Accessible sheet description</SheetDescription>
          </SheetHeader>
          <p>Accessible content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    fireEvent.click(trigger);

    // Check for dialog role and proper labeling
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Accessible Sheet')).toBeInTheDocument();
  });

  it('can be closed with the close button', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Closeable Sheet</SheetTitle>
            <SheetDescription>Closeable sheet description</SheetDescription>
          </SheetHeader>
          <p>Closeable content</p>
        </SheetContent>
      </Sheet>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    fireEvent.click(trigger);

    // Sheet should be open
    expect(screen.getByText('Closeable content')).toBeInTheDocument();

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    // Sheet should be closed (content no longer visible)
    expect(screen.queryByText('Closeable content')).not.toBeInTheDocument();
  });
});
