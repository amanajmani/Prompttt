import { render, screen, fireEvent } from '@testing-library/react';
import {
  TwoColumnLayout,
  ResponsiveSidebar,
  SidebarOverlay,
} from '../two-column-layout';

describe('TwoColumnLayout', () => {
  const mockSidebar = <div data-testid="sidebar">Sidebar content</div>;
  const mockMain = <div data-testid="main">Main content</div>;

  it('renders sidebar and main content', () => {
    render(<TwoColumnLayout sidebar={mockSidebar}>{mockMain}</TwoColumnLayout>);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });

  it('applies default layout classes', () => {
    render(
      <TwoColumnLayout sidebar={mockSidebar} data-testid="layout">
        {mockMain}
      </TwoColumnLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass(
      'flex',
      'flex-col',
      'lg:grid',
      'lg:grid-cols-[auto_1fr]',
      'gap-8'
    );
  });

  it('applies sidebar width classes correctly', () => {
    const widths = ['sm', 'md', 'lg', 'xl'] as const;
    const expectedClasses = ['lg:w-64', 'lg:w-80', 'lg:w-96', 'lg:w-[28rem]'];

    widths.forEach((width, index) => {
      const { unmount } = render(
        <TwoColumnLayout sidebar={mockSidebar} sidebarWidth={width}>
          {mockMain}
        </TwoColumnLayout>
      );

      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass(expectedClasses[index]);

      unmount();
    });
  });

  it('applies gap classes correctly', () => {
    const gaps = ['sm', 'md', 'lg', 'xl'] as const;
    const expectedClasses = ['gap-4', 'gap-6', 'gap-8', 'gap-12'];

    gaps.forEach((gap, index) => {
      const { unmount } = render(
        <TwoColumnLayout sidebar={mockSidebar} gap={gap} data-testid="layout">
          {mockMain}
        </TwoColumnLayout>
      );

      const layout = screen.getByTestId('layout');
      expect(layout).toHaveClass(expectedClasses[index]);

      unmount();
    });
  });

  it('handles right sidebar positioning', () => {
    render(
      <TwoColumnLayout
        sidebar={mockSidebar}
        sidebarPosition="right"
        data-testid="layout"
      >
        {mockMain}
      </TwoColumnLayout>
    );

    const layout = screen.getByTestId('layout');
    const sidebar = screen.getByRole('complementary');
    const main = screen.getByRole('main');

    expect(layout).toHaveClass('lg:grid-cols-[1fr_auto]');
    expect(sidebar).toHaveClass('lg:order-2');
    expect(main).toHaveClass('lg:order-1');
  });

  it('handles non-stacking mobile layout', () => {
    render(
      <TwoColumnLayout
        sidebar={mockSidebar}
        stackOnMobile={false}
        data-testid="layout"
      >
        {mockMain}
      </TwoColumnLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass(
      'grid',
      'grid-cols-1',
      'lg:grid-cols-[auto_1fr]'
    );
    expect(layout).not.toHaveClass('flex', 'flex-col');
  });

  it('applies proper ARIA labels', () => {
    render(<TwoColumnLayout sidebar={mockSidebar}>{mockMain}</TwoColumnLayout>);

    const sidebar = screen.getByRole('complementary');
    const main = screen.getByRole('main');

    expect(sidebar).toHaveAttribute('aria-label', 'Sidebar content');
    expect(main).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <TwoColumnLayout
        sidebar={mockSidebar}
        className="custom-layout"
        data-testid="layout"
      >
        {mockMain}
      </TwoColumnLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass('custom-layout');
  });
});

describe('ResponsiveSidebar', () => {
  it('renders children correctly', () => {
    render(
      <ResponsiveSidebar>
        <div data-testid="sidebar-content">Sidebar content</div>
      </ResponsiveSidebar>
    );

    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });

  it('applies default open state classes', () => {
    render(
      <ResponsiveSidebar data-testid="sidebar">
        <div>Content</div>
      </ResponsiveSidebar>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).not.toHaveAttribute('aria-hidden');
  });

  it('applies closed state classes', () => {
    render(
      <ResponsiveSidebar isOpen={false} data-testid="sidebar">
        <div>Content</div>
      </ResponsiveSidebar>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('-translate-x-full');
    expect(sidebar).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles right position correctly', () => {
    render(
      <ResponsiveSidebar position="right" isOpen={false} data-testid="sidebar">
        <div>Content</div>
      </ResponsiveSidebar>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('translate-x-full', 'right-0');
  });

  it('renders close button when onToggle provided', () => {
    const mockToggle = jest.fn();

    render(
      <ResponsiveSidebar onToggle={mockToggle}>
        <div>Content</div>
      </ResponsiveSidebar>
    );

    const closeButton = screen.getByLabelText('Close sidebar');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onToggle when close button clicked', () => {
    const mockToggle = jest.fn();

    render(
      <ResponsiveSidebar onToggle={mockToggle}>
        <div>Content</div>
      </ResponsiveSidebar>
    );

    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});

describe('SidebarOverlay', () => {
  it('renders when open', () => {
    render(<SidebarOverlay isOpen={true} onClose={jest.fn()} />);

    const overlay = document.querySelector('.fixed.inset-0.z-40');
    expect(overlay).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SidebarOverlay isOpen={false} onClose={jest.fn()} />);

    const overlay = document.querySelector('.fixed.inset-0.z-40');
    expect(overlay).not.toBeInTheDocument();
  });

  it('calls onClose when clicked', () => {
    const mockClose = jest.fn();

    render(<SidebarOverlay isOpen={true} onClose={mockClose} />);

    const overlay = document.querySelector('.fixed.inset-0.z-40');
    fireEvent.click(overlay!);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
