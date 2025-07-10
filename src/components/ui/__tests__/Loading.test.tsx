import { render, screen } from '@/utils/test-utils'
import { 
  LoadingSpinner,
  Skeleton,
  LoadingState,
  VideoCardSkeleton,
  ProfileSkeleton,
  ButtonSkeleton,
  TextSkeleton,
  VideoGridSkeleton,
  PageLoading
} from '../Loading'

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('lucide-loader-circle')
  })

  it('renders different sizes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    let spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-4', 'h-4')

    rerender(<LoadingSpinner size="md" />)
    spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-6', 'h-6')

    rerender(<LoadingSpinner size="lg" />)
    spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-8', 'h-8')

    rerender(<LoadingSpinner size="xl" />)
    spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('custom-class')
  })

  it('has spinning animation', () => {
    render(<LoadingSpinner />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('animate-spin')
  })
})

describe('Skeleton Component', () => {
  it('renders with default props', () => {
    render(<Skeleton />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-secondary-surface/60')
  })

  it('renders text variant correctly', () => {
    render(<Skeleton variant="text" />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toHaveClass('h-4', 'rounded')
  })

  it('renders circular variant correctly', () => {
    render(<Skeleton variant="circular" />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('renders rectangular variant correctly', () => {
    render(<Skeleton variant="rectangular" />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toHaveClass('rounded')
  })

  it('applies custom width and height', () => {
    render(<Skeleton width="200px" height="100px" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' })
  })

  it('renders multiple lines for text variant', () => {
    render(<Skeleton variant="text" lines={3} />)
    const container = document.querySelector('.animate-pulse')
    const lines = container?.querySelectorAll('.h-4')
    expect(lines).toHaveLength(3)
  })

  it('has pulse animation', () => {
    render(<Skeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('animate-pulse')
  })
})

describe('LoadingState Component', () => {
  it('shows children when not loading', () => {
    render(
      <LoadingState isLoading={false}>
        <div>Content loaded</div>
      </LoadingState>
    )
    expect(screen.getByText('Content loaded')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(
      <LoadingState isLoading={true}>
        <div>Content loaded</div>
      </LoadingState>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument()
  })

  it('shows custom fallback when provided', () => {
    render(
      <LoadingState isLoading={true} fallback={<div>Custom loading</div>}>
        <div>Content loaded</div>
      </LoadingState>
    )
    expect(screen.getByText('Custom loading')).toBeInTheDocument()
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <LoadingState isLoading={true} className="custom-class">
        <div>Content</div>
      </LoadingState>
    )
    const container = screen.getByRole('status').parentElement
    expect(container).toHaveClass('custom-class')
  })
})

describe('VideoCardSkeleton Component', () => {
  it('renders video card skeleton structure', () => {
    render(<VideoCardSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading video card')
  })

  it('has proper aspect ratio for video thumbnail', () => {
    render(<VideoCardSkeleton />)
    const skeleton = screen.getByRole('status')
    const thumbnailSkeleton = skeleton.querySelector('.aspect-video')
    expect(thumbnailSkeleton).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<VideoCardSkeleton className="custom-class" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-class')
  })
})

describe('ProfileSkeleton Component', () => {
  it('renders profile skeleton structure', () => {
    render(<ProfileSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading profile')
  })

  it('includes avatar skeleton', () => {
    render(<ProfileSkeleton />)
    const skeleton = screen.getByRole('status')
    const avatarSkeleton = skeleton.querySelector('.rounded-full')
    expect(avatarSkeleton).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ProfileSkeleton className="custom-class" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-class')
  })
})

describe('ButtonSkeleton Component', () => {
  it('renders button skeleton', () => {
    render(<ButtonSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading button')
  })

  it('has button-like dimensions', () => {
    render(<ButtonSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-10', 'rounded-lg')
  })
})

describe('TextSkeleton Component', () => {
  it('renders text skeleton', () => {
    render(<TextSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading text')
  })

  it('renders multiple lines when specified', () => {
    render(<TextSkeleton lines={3} />)
    const container = screen.getByRole('status')
    const lines = container.querySelectorAll('.h-4')
    expect(lines).toHaveLength(3)
  })
})

describe('VideoGridSkeleton Component', () => {
  it('renders video grid skeleton', () => {
    render(<VideoGridSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading video grid')
  })

  it('renders specified number of items', () => {
    render(<VideoGridSkeleton count={6} />)
    const container = screen.getByRole('status')
    const items = container.querySelectorAll('[role="status"]')
    // Should have 6 VideoCardSkeleton components, each with role="status"
    expect(items).toHaveLength(6)
  })

  it('has responsive grid layout', () => {
    render(<VideoGridSkeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('grid')
  })
})

describe('PageLoading Component', () => {
  it('renders page loading with message', () => {
    render(<PageLoading message="Loading page..." />)
    expect(screen.getByText('Loading page...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with default message when none provided', () => {
    render(<PageLoading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('centers content properly', () => {
    render(<PageLoading />)
    const container = screen.getByText('Loading...').parentElement
    expect(container).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('has full height layout', () => {
    render(<PageLoading />)
    const container = screen.getByText('Loading...').parentElement
    expect(container).toHaveClass('min-h-screen')
  })
})

describe('Theme support', () => {
  it('renders correctly in dark theme', () => {
    render(<LoadingSpinner />, { theme: 'dark' })
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('renders correctly in light theme', () => {
    render(<LoadingSpinner />, { theme: 'light' })
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('skeleton adapts to theme', () => {
    render(<Skeleton />, { theme: 'dark' })
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('bg-secondary-surface')
  })
})

describe('Accessibility', () => {
  it('all loading components have proper ARIA labels', () => {
    render(
      <div>
        <LoadingSpinner />
        <Skeleton />
        <VideoCardSkeleton />
        <ProfileSkeleton />
        <ButtonSkeleton />
        <TextSkeleton />
        <VideoGridSkeleton />
      </div>
    )

    const loadingElements = screen.getAllByRole('status')
    expect(loadingElements.length).toBeGreaterThan(0)
    
    loadingElements.forEach(element => {
      expect(element).toHaveAttribute('aria-label')
    })
  })

  it('loading states are announced to screen readers', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-live', 'polite')
  })
})

describe('Performance considerations', () => {
  it('skeleton components use efficient CSS animations', () => {
    render(<Skeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('loading spinner uses transform-based animation', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner.querySelector('svg')).toHaveClass('animate-spin')
  })
})