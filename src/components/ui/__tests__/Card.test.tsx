import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  ImageCard, 
  VideoCard 
} from '../Card'

describe('Card Component', () => {
  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Content</Card>)
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Card variant="default" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-secondary-surface', 'border', 'border-border', 'shadow-sm')
    })

    it('renders elevated variant correctly', () => {
      render(<Card variant="elevated" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-secondary-surface', 'shadow-lg')
    })

    it('renders outlined variant correctly', () => {
      render(<Card variant="outlined" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-primary-bg', 'border-2', 'border-border')
    })

    it('renders ghost variant correctly', () => {
      render(<Card variant="ghost" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-transparent')
    })
  })

  describe('Padding options', () => {
    it('renders with no padding', () => {
      render(<Card padding="none" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-0')
    })

    it('renders with small padding', () => {
      render(<Card padding="sm" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-3', 'sm:p-4')
    })

    it('renders with medium padding (default)', () => {
      render(<Card padding="md" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-4', 'sm:p-6')
    })

    it('renders with large padding', () => {
      render(<Card padding="lg" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-6', 'sm:p-8')
    })

    it('renders with extra large padding', () => {
      render(<Card padding="xl" data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('p-8', 'sm:p-10')
    })
  })

  describe('Interactive behavior', () => {
    it('applies interactive styles when interactive is true', () => {
      render(<Card interactive data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('cursor-pointer', 'transition-all', 'hover:shadow-md')
    })

    it('handles click events when interactive', () => {
      const handleClick = jest.fn()
      render(<Card interactive onClick={handleClick} data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not apply interactive styles when interactive is false', () => {
      render(<Card interactive={false} data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).not.toHaveClass('cursor-pointer')
    })
  })

  describe('Full width option', () => {
    it('applies full width when fullWidth is true', () => {
      render(<Card fullWidth data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('w-full')
    })

    it('does not apply full width by default', () => {
      render(<Card data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).not.toHaveClass('w-full')
    })
  })
})

describe('CardHeader Component', () => {
  it('renders with default props', () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>)
    
    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent('Header content')
  })

  it('applies padding classes correctly', () => {
    render(<CardHeader padding="lg" data-testid="header">Header</CardHeader>)
    
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('p-6', 'sm:p-8')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardHeader ref={ref}>Header</CardHeader>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardContent Component', () => {
  it('renders with default props', () => {
    render(<CardContent data-testid="content">Content text</CardContent>)
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Content text')
  })

  it('applies padding classes correctly', () => {
    render(<CardContent padding="sm" data-testid="content">Content</CardContent>)
    
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('p-3', 'sm:p-4')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardContent ref={ref}>Content</CardContent>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardFooter Component', () => {
  it('renders with default props', () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>)
    
    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveTextContent('Footer content')
  })

  it('applies padding classes correctly', () => {
    render(<CardFooter padding="none" data-testid="footer">Footer</CardFooter>)
    
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('p-0')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardFooter ref={ref}>Footer</CardFooter>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('ImageCard Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    title: 'Test Title',
    description: 'Test description'
  }

  it('renders with required props', () => {
    render(<ImageCard {...defaultProps} data-testid="image-card" />)
    
    const card = screen.getByTestId('image-card')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders image with correct attributes', () => {
    render(<ImageCard {...defaultProps} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  it('applies interactive styles when interactive is true', () => {
    render(<ImageCard {...defaultProps} interactive data-testid="image-card" />)
    
    const card = screen.getByTestId('image-card')
    expect(card).toHaveClass('cursor-pointer', 'transition-all')
  })

  it('handles click events when interactive', () => {
    const handleClick = jest.fn()
    render(<ImageCard {...defaultProps} interactive onClick={handleClick} data-testid="image-card" />)
    
    const card = screen.getByTestId('image-card')
    fireEvent.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders without description when not provided', () => {
    const propsWithoutDescription = { ...defaultProps }
    delete (propsWithoutDescription as any).description
    
    render(<ImageCard {...propsWithoutDescription} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.queryByText('Test description')).not.toBeInTheDocument()
  })
})

describe('VideoCard Component', () => {
  const defaultProps = {
    src: '/test-video.mp4',
    title: 'Test Video',
    description: 'Test video description'
  }

  it('renders with required props', () => {
    render(<VideoCard {...defaultProps} data-testid="video-card" />)
    
    const card = screen.getByTestId('video-card')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Test video description')).toBeInTheDocument()
  })

  it('renders video element with correct attributes', () => {
    render(<VideoCard {...defaultProps} />)
    
    const video = screen.getByRole('application') // video elements have application role
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/test-video.mp4')
  })

  it('applies interactive styles when interactive is true', () => {
    render(<VideoCard {...defaultProps} interactive data-testid="video-card" />)
    
    const card = screen.getByTestId('video-card')
    expect(card).toHaveClass('cursor-pointer', 'transition-all')
  })

  it('handles click events when interactive', () => {
    const handleClick = jest.fn()
    render(<VideoCard {...defaultProps} interactive onClick={handleClick} data-testid="video-card" />)
    
    const card = screen.getByTestId('video-card')
    fireEvent.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders without description when not provided', () => {
    const propsWithoutDescription = { ...defaultProps }
    delete (propsWithoutDescription as any).description
    
    render(<VideoCard {...propsWithoutDescription} />)
    
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.queryByText('Test video description')).not.toBeInTheDocument()
  })

  it('passes video props to video element', () => {
    render(<VideoCard {...defaultProps} controls autoPlay muted />)
    
    const video = screen.getByRole('application')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('muted')
  })
})