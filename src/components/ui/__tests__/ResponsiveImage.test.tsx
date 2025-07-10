import { render, screen } from '@/utils/test-utils'
import { 
  ResponsiveImage, 
  LogoImage, 
  IconImage, 
  AvatarImage, 
  ThumbnailImage, 
  HeroImage, 
  CardImage 
} from '../ResponsiveImage'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, sizes, priority, quality, ...props }: {
    src: string
    alt: string
    className?: string
    sizes?: string
    priority?: boolean
    quality?: number
    [key: string]: unknown
  }) => (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      data-sizes={sizes}
      data-priority={priority?.toString()}
      data-quality={quality?.toString()}
      {...props}
    />
  ),
}))

describe('ResponsiveImage Component', () => {
  describe('Basic functionality', () => {
    it('renders with required props', () => {
      render(
        <ResponsiveImage 
          src="/test-image.png" 
          alt="Test image" 
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.png')
    })

    it('applies custom className', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test" 
          className="custom-class"
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveClass('custom-class')
    })

    it('sets priority loading when specified', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test" 
          priority={true}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-priority', 'true')
    })

    it('sets custom quality when specified', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test" 
          quality={95}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-quality', '95')
    })
  })

  describe('Responsive breakpoints', () => {
    it('generates responsive sizes from breakpoints', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          breakpoints={{
            mobile: '32px',
            tablet: '48px',
            desktop: '64px'
          }}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 32px, (max-width: 768px) 48px, 64px')
    })

    it('uses custom sizes when provided', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          sizes="(max-width: 500px) 100px, 200px"
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 500px) 100px, 200px')
    })
  })

  describe('Screen density variants', () => {
    it('handles density variants correctly', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          densityVariants={{
            '1x': '/test.png',
            '2x': '/test@2x.png',
            '3x': '/test@3x.png'
          }}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-srcset', '/test.png 1x, /test@2x.png 2x, /test@3x.png 3x')
    })

    it('handles partial density variants', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          densityVariants={{
            '1x': '/test.png',
            '2x': '/test@2x.png'
          }}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveAttribute('data-srcset', '/test.png 1x, /test@2x.png 2x')
    })
  })

  describe('Fill mode', () => {
    it('handles fill mode correctly', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          fill={true}
        />
      )
      
      const image = screen.getByAltText('Test')
      expect(image).toHaveClass('absolute', 'inset-0')
    })
  })
})

describe('Specialized Image Components', () => {
  describe('LogoImage', () => {
    it('renders with logo-specific defaults', () => {
      render(<LogoImage src="/logo.png" alt="Logo" />)
      
      const image = screen.getByAltText('Logo')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 32px, (max-width: 768px) 40px, 48px')
      expect(image).toHaveClass('h-auto', 'w-auto')
    })

    it('accepts custom alt text', () => {
      render(<LogoImage src="/logo.png" alt="Company Logo" />)
      
      const image = screen.getByAltText('Company Logo')
      expect(image).toBeInTheDocument()
    })
  })

  describe('IconImage', () => {
    it('renders with icon-specific defaults', () => {
      render(<IconImage src="/icon.png" alt="Icon" />)
      
      const image = screen.getByAltText('Icon')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 16px, (max-width: 768px) 20px, 24px')
    })
  })

  describe('AvatarImage', () => {
    it('renders with avatar-specific styling', () => {
      render(<AvatarImage src="/avatar.png" alt="Avatar" />)
      
      const image = screen.getByAltText('Avatar')
      expect(image).toBeInTheDocument()
      expect(image).toHaveClass('rounded-full', 'object-cover')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 32px, (max-width: 768px) 40px, 48px')
    })
  })

  describe('ThumbnailImage', () => {
    it('renders with thumbnail-specific styling', () => {
      render(<ThumbnailImage src="/thumb.png" alt="Thumbnail" />)
      
      const image = screen.getByAltText('Thumbnail')
      expect(image).toBeInTheDocument()
      expect(image).toHaveClass('rounded-lg', 'object-cover')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 120px, (max-width: 768px) 160px, 200px')
    })
  })

  describe('HeroImage', () => {
    it('renders with hero-specific settings', () => {
      render(<HeroImage src="/hero.png" alt="Hero image" />)
      
      const image = screen.getByAltText('Hero image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveClass('w-full', 'object-cover')
      expect(image).toHaveAttribute('data-priority', 'true') // Heroes should load with priority
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw')
    })
  })

  describe('CardImage', () => {
    it('renders with card-specific styling', () => {
      render(<CardImage src="/card.png" alt="Card image" />)
      
      const image = screen.getByAltText('Card image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveClass('aspect-video', 'w-full', 'object-cover')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw')
    })
  })
})

describe('Responsive behavior', () => {
  describe('Mobile-first approach', () => {
    it('prioritizes mobile sizes in responsive configurations', () => {
      render(
        <ResponsiveImage 
          src="/test.png" 
          alt="Test"
          breakpoints={{
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw'
          }}
          width={100} 
          height={100} 
        />
      )
      
      const image = screen.getByAltText('Test')
      const sizes = image.getAttribute('data-sizes')
      expect(sizes).toMatch(/max-width: 640px.*100vw/)
    })
  })

  describe('Performance optimization', () => {
    it('sets appropriate quality for different image types', () => {
      render(<LogoImage src="/logo.png" alt="Logo" quality={95} />)
      
      const image = screen.getByAltText('Logo')
      expect(image).toHaveAttribute('data-quality', '95')
    })

    it('enables priority loading for hero images', () => {
      render(<HeroImage src="/hero.png" alt="Hero image" />)
      
      const image = screen.getByAltText('Hero image')
      expect(image).toHaveAttribute('data-priority', 'true')
    })
  })
})

describe('Accessibility', () => {
  it('requires alt text for all images', () => {
    render(<ResponsiveImage src="/test.png" alt="Descriptive alt text" width={100} height={100} />)
    
    const image = screen.getByAltText('Descriptive alt text')
    expect(image).toBeInTheDocument()
  })

  it('provides meaningful default alt text for specialized components', () => {
    render(<LogoImage src="/logo.png" alt="Logo" />)
    render(<IconImage src="/icon.png" alt="Icon" />)
    render(<AvatarImage src="/avatar.png" alt="Avatar" />)
    
    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByAltText('Icon')).toBeInTheDocument()
    expect(screen.getByAltText('Avatar')).toBeInTheDocument()
  })
})