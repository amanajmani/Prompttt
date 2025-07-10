import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { FadeIn, Scale, Bounce, Slide, Reveal } from '../Animation'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

describe('FadeIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<FadeIn data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })

    it('applies custom className', () => {
      render(<FadeIn className="custom-class" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<FadeIn ref={ref}>Content</FadeIn>)
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Animation directions', () => {
    it('renders with up direction', () => {
      render(<FadeIn direction="up" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })

    it('renders with down direction', () => {
      render(<FadeIn direction="down" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })

    it('renders with left direction', () => {
      render(<FadeIn direction="left" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })

    it('renders with right direction', () => {
      render(<FadeIn direction="right" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })

    it('renders with none direction', () => {
      render(<FadeIn direction="none" data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Custom distance', () => {
    it('renders with custom distance', () => {
      render(<FadeIn direction="up" distance={50} data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Animation timing', () => {
    it('renders with custom duration', () => {
      render(<FadeIn duration={1000} data-testid="fade-in">Content</FadeIn>)
      
      const element = screen.getByTestId('fade-in')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Intersection Observer', () => {
    it('sets up intersection observer', () => {
      render(<FadeIn>Content</FadeIn>)
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      )
    })
  })
})

describe('Scale Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Scale data-testid="scale">Content</Scale>)
      
      const element = screen.getByTestId('scale')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })

    it('renders with custom initial scale', () => {
      render(<Scale data-testid="scale">Content</Scale>)
      
      const element = screen.getByTestId('scale')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Animation timing', () => {
    it('renders with custom duration', () => {
      render(<Scale duration={800} data-testid="scale">Content</Scale>)
      
      const element = screen.getByTestId('scale')
      expect(element).toBeInTheDocument()
    })
  })
})

describe('Bounce Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Bounce data-testid="bounce">Content</Bounce>)
      
      const element = screen.getByTestId('bounce')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })

    it('applies bounce animation class', () => {
      render(<Bounce data-testid="bounce">Content</Bounce>)
      
      const element = screen.getByTestId('bounce')
      expect(element).toHaveClass('animate-bounce-in')
    })
  })

  describe('Animation timing', () => {
    it('applies custom duration', () => {
      render(<Bounce duration={1200} data-testid="bounce">Content</Bounce>)
      
      const element = screen.getByTestId('bounce')
      expect(element).toHaveStyle('animation-duration: 1200ms')
    })
  })

  describe('Bounce intensity', () => {
    it('applies gentle bounce intensity', () => {
      render(<Bounce intensity="gentle" data-testid="bounce">Content</Bounce>)
      
      const element = screen.getByTestId('bounce')
      expect(element).toHaveClass('animate-bounce-gentle')
    })

    it('applies strong bounce intensity', () => {
      render(<Bounce intensity="strong" data-testid="bounce">Content</Bounce>)
      
      const element = screen.getByTestId('bounce')
      expect(element).toHaveClass('animate-bounce-strong')
    })
  })
})

describe('Slide Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Slide data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })
  })

  describe('Slide directions', () => {
    it('applies left slide direction', () => {
      render(<Slide direction="left" data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toHaveStyle('transform: translateX(100%)')
    })

    it('applies right slide direction', () => {
      render(<Slide direction="right" data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toHaveStyle('transform: translateX(-100%)')
    })

    it('applies up slide direction', () => {
      render(<Slide direction="up" data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toHaveStyle('transform: translateY(100%)')
    })

    it('applies down slide direction', () => {
      render(<Slide direction="down" data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toHaveStyle('transform: translateY(-100%)')
    })
  })

  describe('Custom distance', () => {
    it('applies custom distance for left direction', () => {
      render(<Slide direction="left" distance={200} data-testid="slide">Content</Slide>)
      
      const element = screen.getByTestId('slide')
      expect(element).toHaveStyle('transform: translateX(200px)')
    })
  })
})

describe('Reveal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Reveal data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Content')
    })

    it('applies initial hidden state', () => {
      render(<Reveal data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('opacity: 0')
    })
  })

  describe('Reveal directions', () => {
    it('applies clip-path for top direction', () => {
      render(<Reveal direction="top" data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('clip-path: inset(0 0 100% 0)')
    })

    it('applies clip-path for bottom direction', () => {
      render(<Reveal direction="bottom" data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('clip-path: inset(100% 0 0 0)')
    })

    it('applies clip-path for left direction', () => {
      render(<Reveal direction="left" data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('clip-path: inset(0 100% 0 0)')
    })

    it('applies clip-path for right direction', () => {
      render(<Reveal direction="right" data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('clip-path: inset(0 0 0 100%)')
    })
  })

  describe('Animation timing', () => {
    it('applies custom duration', () => {
      render(<Reveal duration={1500} data-testid="reveal">Content</Reveal>)
      
      const element = screen.getByTestId('reveal')
      expect(element).toHaveStyle('transition-duration: 1500ms')
    })
  })
})

describe('Animation Components Integration', () => {
  it('can be nested together', () => {
    render(
      <FadeIn data-testid="fade-in">
        <Scale data-testid="scale">
          <Bounce data-testid="bounce">
            Nested content
          </Bounce>
        </Scale>
      </FadeIn>
    )
    
    expect(screen.getByTestId('fade-in')).toBeInTheDocument()
    expect(screen.getByTestId('scale')).toBeInTheDocument()
    expect(screen.getByTestId('bounce')).toBeInTheDocument()
    expect(screen.getByText('Nested content')).toBeInTheDocument()
  })

  it('maintains proper DOM structure when nested', () => {
    render(
      <FadeIn data-testid="outer">
        <div data-testid="middle">
          <Scale data-testid="inner">Content</Scale>
        </div>
      </FadeIn>
    )
    
    const outer = screen.getByTestId('outer')
    const middle = screen.getByTestId('middle')
    const inner = screen.getByTestId('inner')
    
    expect(outer).toContainElement(middle)
    expect(middle).toContainElement(inner)
  })
})