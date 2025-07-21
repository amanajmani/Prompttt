import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface TwoColumnLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  stackOnMobile?: boolean;
  sidebarCollapsible?: boolean;
}

/**
 * Enterprise-grade TwoColumnLayout component
 *
 * Features:
 * - Mobile-first responsive design with automatic stacking
 * - Configurable sidebar position (left/right)
 * - Multiple sidebar width options
 * - Responsive gap configuration
 * - Optional sidebar collapsing on mobile
 * - Accessibility support with proper landmarks
 * - CSS Grid-based for optimal performance
 */
const TwoColumnLayout = forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  (
    {
      children,
      sidebar,
      sidebarPosition = 'left',
      sidebarWidth = 'md',
      gap = 'lg',
      stackOnMobile = true,
      sidebarCollapsible = false,
      className,
      ...props
    },
    ref
  ) => {
    // Sidebar width configurations
    const sidebarWidthClasses = {
      sm: 'lg:w-64', // 256px
      md: 'lg:w-80', // 320px
      lg: 'lg:w-96', // 384px
      xl: 'lg:w-[28rem]', // 448px
    };

    // Gap configurations
    const gapClasses = {
      sm: 'gap-4', // 16px
      md: 'gap-6', // 24px
      lg: 'gap-8', // 32px
      xl: 'gap-12', // 48px
    };

    // Layout classes based on sidebar position
    const layoutClasses = stackOnMobile
      ? 'flex flex-col lg:grid lg:grid-cols-[auto_1fr]'
      : 'grid grid-cols-1 lg:grid-cols-[auto_1fr]';

    // Order classes for sidebar position
    const sidebarOrderClass =
      sidebarPosition === 'right' ? 'lg:order-2' : 'lg:order-1';

    const mainOrderClass =
      sidebarPosition === 'right' ? 'lg:order-1' : 'lg:order-2';

    // Grid template adjustment for right sidebar
    const gridTemplateClass =
      sidebarPosition === 'right'
        ? 'lg:grid-cols-[1fr_auto]'
        : 'lg:grid-cols-[auto_1fr]';

    return (
      <div
        ref={ref}
        className={cn(
          // Base layout
          layoutClasses,
          gridTemplateClass,
          gapClasses[gap],

          // Responsive behavior
          'min-h-0', // Prevent grid items from growing

          className
        )}
        {...props}
      >
        {/* Sidebar */}
        <aside
          className={cn(
            // Base sidebar styles
            'flex-shrink-0',

            // Width configuration
            sidebarWidthClasses[sidebarWidth],

            // Mobile behavior
            stackOnMobile && sidebarCollapsible && 'hidden lg:block',

            // Order for positioning
            sidebarOrderClass,

            // Mobile-first width - only apply lg:w-auto if not using specific width
            'w-full'
          )}
          role="complementary"
          aria-label="Sidebar content"
        >
          {sidebar}
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            // Base main content styles
            'min-w-0', // Prevent overflow in grid
            'flex-1',

            // Order for positioning
            mainOrderClass
          )}
          role="main"
        >
          {children}
        </main>
      </div>
    );
  }
);

TwoColumnLayout.displayName = 'TwoColumnLayout';

/**
 * Responsive sidebar component with built-in mobile behavior
 */
interface ResponsiveSidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  position?: 'left' | 'right';
}

const ResponsiveSidebar = forwardRef<HTMLElement, ResponsiveSidebarProps>(
  (
    {
      children,
      isOpen = true,
      onToggle,
      position = 'left',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          // Base styles
          'border-border bg-background',

          // Mobile overlay behavior
          'fixed inset-y-0 z-50 w-80 border-r transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0',

          // Position-based transforms
          position === 'left'
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} left-0`
            : `${isOpen ? 'translate-x-0' : 'translate-x-full'} right-0`,

          // Desktop behavior
          'lg:w-auto lg:border-r-0',

          className
        )}
        role="complementary"
        aria-hidden={!isOpen ? 'true' : undefined}
        {...props}
      >
        {/* Mobile close button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute right-4 top-4 rounded-md p-2 hover:bg-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {children}
      </aside>
    );
  }
);

ResponsiveSidebar.displayName = 'ResponsiveSidebar';

/**
 * Mobile sidebar overlay backdrop
 */
interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

export {
  TwoColumnLayout,
  ResponsiveSidebar,
  SidebarOverlay,
  type TwoColumnLayoutProps,
  type ResponsiveSidebarProps,
  type SidebarOverlayProps,
};
