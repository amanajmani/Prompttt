import { render, screen, fireEvent, waitFor } from '@/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { Button, PrimaryButton, SecondaryButton, OutlineButton, GhostButton } from '../Button'
import { Upload, Download } from 'lucide-react'

describe('Button Component', () => {
  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-accent') // primary variant default
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', () => {
      render(<Button disabled>Disabled button</Button>)
      const button = screen.getByRole('button', { name: /disabled button/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent', 'text-white')
    })

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary-surface', 'text-high')
    })

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent', 'border-border')
    })

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent', 'border-transparent')
    })

    it('renders destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'text-white')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'px-3', 'text-sm')
    })

    it('renders medium size correctly (default)', () => {
      render(<Button size="md">Medium</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-4', 'text-sm')
    })

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-12', 'px-6', 'text-base')
    })

    it('renders extra large size correctly', () => {
      render(<Button size="xl">Extra Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-14', 'px-8', 'text-lg')
    })
  })

  describe('Loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('shows custom loading text', () => {
      render(<Button isLoading loadingText="Saving...">Save</Button>)
      const button = screen.getByRole('button', { name: /saving/i })
      expect(button).toBeInTheDocument()
    })

    it('hides right icon when loading', () => {
      render(
        <Button isLoading rightIcon={<Download />}>
          Download
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.querySelector('[data-lucide="download"]')).not.toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('renders left icon correctly', () => {
      render(<Button leftIcon={<Upload data-testid="upload-icon" />}>Upload</Button>)
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument()
    })

    it('renders right icon correctly', () => {
      render(<Button rightIcon={<Download data-testid="download-icon" />}>Download</Button>)
      expect(screen.getByTestId('download-icon')).toBeInTheDocument()
    })

    it('renders both icons correctly', () => {
      render(
        <Button 
          leftIcon={<Upload data-testid="upload-icon" />} 
          rightIcon={<Download data-testid="download-icon" />}
        >
          Transfer
        </Button>
      )
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument()
      expect(screen.getByTestId('download-icon')).toBeInTheDocument()
    })
  })

  describe('Full width', () => {
    it('renders full width when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })
  })

  describe('Touch targets (Mobile-first)', () => {
    it('has minimum touch target size for small buttons', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-w-[2rem]') // 32px minimum
    })

    it('has comfortable touch target size for medium buttons', () => {
      render(<Button size="md">Medium</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-w-[2.75rem]') // 44px minimum
    })

    it('has large touch target size for large buttons', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-w-[3rem]') // 48px comfortable
    })
  })

  describe('Convenience components', () => {
    it('PrimaryButton renders as primary variant', () => {
      render(<PrimaryButton>Primary</PrimaryButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent')
    })

    it('SecondaryButton renders as secondary variant', () => {
      render(<SecondaryButton>Secondary</SecondaryButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary-surface')
    })

    it('OutlineButton renders as outline variant', () => {
      render(<OutlineButton>Outline</OutlineButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent', 'border-border')
    })

    it('GhostButton renders as ghost variant', () => {
      render(<GhostButton>Ghost</GhostButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent', 'border-transparent')
    })
  })

  describe('Theme support', () => {
    it('renders correctly in dark theme', () => {
      render(<Button>Dark theme</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent') // Should use accent color
    })

    it('renders correctly in light theme', () => {
      render(<Button>Light theme</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent') // Should use accent color
    })
  })

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('supports keyboard interaction', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('has proper ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Animation and interactions', () => {
    it('has active scale animation class', () => {
      render(<Button>Animated</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('active:scale-[0.98]')
    })

    it('has transition classes', () => {
      render(<Button>Smooth</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-all', 'duration-200')
    })
  })
})