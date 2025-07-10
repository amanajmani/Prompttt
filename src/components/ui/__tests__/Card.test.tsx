import { render, screen } from '@/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  VideoCard 
} from '../Card'
import { Play, Heart } from 'lucide-react'

describe('Card Component', () => {
  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-secondary-surface')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('custom-class')
    })

    it('renders full width when specified', () => {
      render(<Card fullWidth>Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('w-full')
    })
  })

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Card variant="default">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('bg-secondary-surface', 'border-border')
    })

    it('renders elevated variant correctly', () => {
      render(<Card variant="elevated">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('shadow-lg')
    })

    it('renders outlined variant correctly', () => {
      render(<Card variant="outlined">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('border-2')
    })

    it('renders ghost variant correctly', () => {
      render(<Card variant="ghost">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('bg-transparent')
    })
  })

  describe('Padding variants', () => {
    it('renders with no padding', () => {
      render(<Card padding="none">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).not.toHaveClass('p-3', 'p-4', 'p-6', 'p-8')
    })

    it('renders with small padding', () => {
      render(<Card padding="sm">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('p-3')
    })

    it('renders with medium padding (default)', () => {
      render(<Card padding="md">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('p-4')
    })

    it('renders with large padding', () => {
      render(<Card padding="lg">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('p-6')
    })

    it('renders with extra large padding', () => {
      render(<Card padding="xl">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('p-8')
    })
  })

  describe('Interactive cards', () => {
    it('renders interactive card with hover effects', () => {
      render(<Card interactive>Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('handles click events when interactive', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Card interactive onClick={handleClick}>Content</Card>)
      const card = screen.getByText('Content')
      
      await user.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Theme support', () => {
    it('renders correctly in dark theme', () => {
      render(<Card>Content</Card>, { theme: 'dark' })
      const card = screen.getByText('Content')
      expect(card).toHaveClass('bg-secondary-surface')
    })

    it('renders correctly in light theme', () => {
      render(<Card>Content</Card>, { theme: 'light' })
      const card = screen.getByText('Content')
      expect(card).toHaveClass('bg-secondary-surface')
    })
  })
})

describe('CardHeader Component', () => {
  it('renders with default props', () => {
    render(<CardHeader>Header content</CardHeader>)
    const header = screen.getByText('Header content')
    expect(header).toBeInTheDocument()
  })

  it('applies custom padding', () => {
    render(<CardHeader padding="lg">Header</CardHeader>)
    const header = screen.getByText('Header')
    expect(header).toHaveClass('p-6')
  })
})

describe('CardTitle Component', () => {
  it('renders as h3 by default', () => {
    render(<CardTitle>Card Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Card Title')
  })

  it('applies correct styling', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByText('Title')
    expect(title).toHaveClass('font-heading', 'font-semibold', 'text-high')
  })
})

describe('CardDescription Component', () => {
  it('renders with correct styling', () => {
    render(<CardDescription>Description text</CardDescription>)
    const description = screen.getByText('Description text')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-medium')
  })
})

describe('CardContent Component', () => {
  it('renders with default props', () => {
    render(<CardContent>Content</CardContent>)
    const content = screen.getByText('Content')
    expect(content).toBeInTheDocument()
  })

  it('applies custom padding', () => {
    render(<CardContent padding="sm">Content</CardContent>)
    const content = screen.getByText('Content')
    expect(content).toHaveClass('px-3', 'py-2')
  })
})

describe('CardFooter Component', () => {
  it('renders with default props', () => {
    render(<CardFooter>Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer).toBeInTheDocument()
  })

  it('applies flex layout by default', () => {
    render(<CardFooter>Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer).toHaveClass('flex')
  })
})

describe('VideoCard Component', () => {
  const mockVideoProps = {
    title: 'Test Video',
    creator: 'testuser',
    thumbnail: '/test-thumbnail.jpg',
    duration: '2:30',
    views: 1337,
    likes: 42
  }

  it('renders video card with all elements', () => {
    render(<VideoCard {...mockVideoProps} />)
    
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('by testuser')).toBeInTheDocument()
    expect(screen.getByText('42 likes')).toBeInTheDocument()
    expect(screen.getByText('1,337 views')).toBeInTheDocument()
    expect(screen.getByText('2:30')).toBeInTheDocument()
  })

  it('handles play button click', async () => {
    const handlePlay = jest.fn()
    const user = userEvent.setup()
    
    render(<VideoCard {...mockVideoProps} onPlay={handlePlay} />)
    
    const card = screen.getByText('Test Video').closest('div[tabindex="0"]')
    await user.click(card!)
    
    expect(handlePlay).toHaveBeenCalled()
  })

  it('handles like button click', async () => {
    const handleLike = jest.fn()
    const user = userEvent.setup()
    
    render(<VideoCard {...mockVideoProps} onLike={handleLike} />)
    
    const likeButton = screen.getByRole('button')
    await user.click(likeButton)
    
    expect(handleLike).toHaveBeenCalled()
  })

  it('shows liked state when isLiked is true', () => {
    render(<VideoCard {...mockVideoProps} isLiked={true} />)
    
    const likeButton = screen.getByRole('button')
    expect(likeButton).toHaveClass('text-red-500')
  })

  it('renders without optional props', () => {
    const minimalProps = {
      title: 'Test Video',
      creator: 'testuser',
      thumbnail: '/test-thumbnail.jpg'
    }
    render(<VideoCard {...minimalProps} />)
    
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('by testuser')).toBeInTheDocument()
  })

  it('renders with all optional props', () => {
    render(<VideoCard {...mockVideoProps} />)
    
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('2:30')).toBeInTheDocument()
    expect(screen.getByText('1,337 views')).toBeInTheDocument()
    expect(screen.getByText('42 likes')).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('has proper image alt text', () => {
      render(<VideoCard {...mockVideoProps} />)
      
      const image = screen.getByAltText('Test Video')
      expect(image).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const handlePlay = jest.fn()
      const user = userEvent.setup()
      
      render(<VideoCard {...mockVideoProps} onPlay={handlePlay} />)
      
      const card = screen.getByText('Test Video').closest('div[tabindex="0"]') as HTMLElement
      card.focus()
      
      await user.keyboard('{Enter}')
      expect(handlePlay).toHaveBeenCalled()
    })
  })

  describe('Touch-friendly design', () => {
    it('has proper touch manipulation class', () => {
      render(<VideoCard {...mockVideoProps} />)
      
      const card = screen.getByText('Test Video').closest('div[tabindex="0"]')
      expect(card).toHaveClass('touch-manipulation')
    })
  })
})