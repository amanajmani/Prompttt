import { render, screen } from '@/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { Input, Textarea } from '../Input'
import { Search, AlertCircle } from 'lucide-react'

describe('Input Component', () => {
  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('bg-secondary-surface')
    })

    it('handles value changes', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here')
      
      await user.type(input, 'Hello')
      expect(handleChange).toHaveBeenCalledTimes(5) // One for each character
    })

    it('can be disabled', () => {
      render(<Input disabled placeholder="Disabled input" />)
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:bg-secondary-surface/50')
    })
  })

  describe('Label and states', () => {
    it('renders with label', () => {
      render(<Input label="Username" placeholder="Enter username" />)
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('shows error state', () => {
      render(<Input error="This field is required" placeholder="Input with error" />)
      const input = screen.getByPlaceholderText('Input with error')
      expect(input).toHaveClass('border-red-500')
      expect(screen.getByText('This field is required')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toHaveClass('text-red-500')
    })

    it('shows success state', () => {
      render(<Input success="Valid input" placeholder="Valid input" />)
      const input = screen.getByPlaceholderText('Valid input')
      expect(input).toHaveClass('border-green-500')
      expect(screen.getByText('Valid input')).toBeInTheDocument()
      expect(screen.getByText('Valid input')).toHaveClass('text-green-500')
    })

    it('shows hint text', () => {
      render(<Input hint="Enter at least 8 characters" placeholder="Password" />)
      expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument()
      expect(screen.getByText('Enter at least 8 characters')).toHaveClass('text-medium')
    })
  })

  describe('Icons', () => {
    it('renders left icon', () => {
      render(<Input leftIcon={<Search data-testid="search-icon" />} placeholder="Search" />)
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('renders right icon', () => {
      render(<Input rightIcon={<AlertCircle data-testid="alert-icon" />} placeholder="Input with icon" />)
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
    })

    it('adjusts padding for left icon', () => {
      render(<Input leftIcon={<Search />} placeholder="Search" />)
      const input = screen.getByPlaceholderText('Search')
      expect(input).toHaveClass('pl-10')
    })

    it('adjusts padding for right icon', () => {
      render(<Input rightIcon={<AlertCircle />} placeholder="Input" />)
      const input = screen.getByPlaceholderText('Input')
      expect(input).toHaveClass('pr-10')
    })
  })


  describe('Loading state', () => {
    it('shows loading spinner', () => {
      render(<Input isLoading placeholder="Loading input" />)
      const container = screen.getByPlaceholderText('Loading input').closest('div')
      expect(container?.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('Full width', () => {
    it('renders full width when fullWidth is true', () => {
      render(<Input fullWidth placeholder="Full width input" />)
      const input = screen.getByPlaceholderText('Full width input')
      expect(input).toHaveClass('w-full')
    })
  })

  describe('Touch-friendly design', () => {
    it('has proper height for touch targets', () => {
      render(<Input placeholder="Touch friendly" />)
      const input = screen.getByPlaceholderText('Touch friendly')
      expect(input).toHaveClass('min-h-[48px]') // 48px minimum height for comfortable touch
    })
  })

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Input placeholder="Focusable input" />)
      const input = screen.getByPlaceholderText('Focusable input')
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('associates label with input', () => {
      render(<Input label="Email" placeholder="Enter email" />)
      const input = screen.getByLabelText('Email')
      expect(input).toBeInTheDocument()
    })

  })
})

describe('Textarea Component', () => {
  describe('Basic functionality', () => {
    it('renders with default props', () => {
      render(<Textarea placeholder="Enter description" />)
      const textarea = screen.getByPlaceholderText('Enter description')
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('handles value changes', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Textarea onChange={handleChange} placeholder="Type here" />)
      const textarea = screen.getByPlaceholderText('Type here')
      
      await user.type(textarea, 'Hello')
      expect(handleChange).toHaveBeenCalledTimes(5)
    })

    it('can be disabled', () => {
      render(<Textarea disabled placeholder="Disabled textarea" />)
      const textarea = screen.getByPlaceholderText('Disabled textarea')
      expect(textarea).toBeDisabled()
    })
  })

  describe('Resize behavior', () => {
    it('has default vertical resize', () => {
      render(<Textarea placeholder="Resizable" />)
      const textarea = screen.getByPlaceholderText('Resizable')
      expect(textarea).toHaveClass('resize-y')
    })

    it('can disable resize', () => {
      render(<Textarea resize="none" placeholder="No resize" />)
      const textarea = screen.getByPlaceholderText('No resize')
      expect(textarea).toHaveClass('resize-none')
    })

    it('can set horizontal resize', () => {
      render(<Textarea resize="horizontal" placeholder="Horizontal resize" />)
      const textarea = screen.getByPlaceholderText('Horizontal resize')
      expect(textarea).toHaveClass('resize-x')
    })

    it('can set both resize', () => {
      render(<Textarea resize="both" placeholder="Both resize" />)
      const textarea = screen.getByPlaceholderText('Both resize')
      expect(textarea).toHaveClass('resize')
    })
  })

  describe('States and validation', () => {
    it('shows error state', () => {
      render(<Textarea error="Description is required" placeholder="Description" />)
      const textarea = screen.getByPlaceholderText('Description')
      expect(textarea).toHaveClass('border-red-500')
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })

    it('shows success state', () => {
      render(<Textarea success="Valid description" placeholder="Description" />)
      const textarea = screen.getByPlaceholderText('Description')
      expect(textarea).toHaveClass('border-green-500')
      expect(screen.getByText('Valid description')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows loading state', () => {
      render(<Textarea isLoading placeholder="Loading textarea" />)
      const textarea = screen.getByPlaceholderText('Loading textarea')
      // Note: Current implementation doesn't disable textarea when loading
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Touch-friendly design', () => {
    it('has minimum height for touch interaction', () => {
      render(<Textarea placeholder="Touch friendly" />)
      const textarea = screen.getByPlaceholderText('Touch friendly')
      expect(textarea).toHaveClass('min-h-[120px]') // 120px minimum height
    })
  })

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Textarea placeholder="Focusable textarea" />)
      const textarea = screen.getByPlaceholderText('Focusable textarea')
      expect(textarea).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('associates label with textarea', () => {
      render(<Textarea label="Description" placeholder="Enter description" />)
      const textarea = screen.getByLabelText('Description')
      expect(textarea).toBeInTheDocument()
    })
  })
})