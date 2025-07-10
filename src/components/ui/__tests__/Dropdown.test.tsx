import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown, DropdownMenu, DropdownMenuItem, DropdownSeparator } from '../Dropdown'
import { Search } from 'lucide-react'

const mockItems = [
  { id: '1', label: 'Option 1', value: 'option1' },
  { id: '2', label: 'Option 2', value: 'option2', description: 'This is option 2' },
  { id: '3', label: 'Option 3', value: 'option3', disabled: true },
  { id: '4', label: 'Option 4', value: 'option4', icon: <Search size={16} /> },
]

describe('Dropdown Component', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('Basic functionality', () => {
    it('renders with placeholder', () => {
      render(
        <Dropdown 
          items={mockItems} 
          onSelect={mockOnSelect} 
          placeholder="Choose an option" 
        />
      )
      
      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('opens dropdown when clicked', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('selects item when clicked', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const option = screen.getByText('Option 1')
      await user.click(option)
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockItems[0])
    })

    it('shows selected value', () => {
      render(
        <Dropdown 
          items={mockItems} 
          onSelect={mockOnSelect} 
          value="option2"
        />
      )
      
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('Keyboard navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      trigger.focus()
      await user.keyboard('{Enter}')
      
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens with Space key', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      trigger.focus()
      await user.keyboard(' ')
      
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('closes with Escape key', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('Searchable dropdown', () => {
    it('renders search input when searchable', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} searchable />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('filters items based on search', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} searchable />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'Option 1')
      
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    })

    it('shows no results message when no matches', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} searchable />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })
  })

  describe('Multi-select functionality', () => {
    it('allows multiple selections', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} multiSelect />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const option1 = screen.getByText('Option 1')
      const option2 = screen.getByText('Option 2')
      
      await user.click(option1)
      await user.click(option2)
      
      expect(mockOnSelect).toHaveBeenCalledTimes(2)
    })

    it('shows count when multiple items selected', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} multiSelect />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const option1 = screen.getByText('Option 1')
      const option2 = screen.getByText('Option 2')
      
      await user.click(option1)
      await user.click(option2)
      
      // Close dropdown to see the count
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.getByText('2 selected')).toBeInTheDocument()
      })
    })
  })

  describe('Disabled state', () => {
    it('does not open when disabled', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} disabled />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('skips disabled items', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const disabledOption = screen.getByText('Option 3')
      await user.click(disabledOption)
      
      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('Variants and sizes', () => {
    it('applies size classes correctly', () => {
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} size="lg" />)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveClass('h-12', 'px-6', 'text-base')
    })

    it('applies variant classes correctly', () => {
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} variant="outline" />)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveClass('bg-transparent', 'border-border')
    })
  })

  describe('Error state', () => {
    it('shows error message', () => {
      render(
        <Dropdown 
          items={mockItems} 
          onSelect={mockOnSelect} 
          error="Please select an option"
        />
      )
      
      expect(screen.getByText('Please select an option')).toBeInTheDocument()
    })

    it('applies error styling', () => {
      render(
        <Dropdown 
          items={mockItems} 
          onSelect={mockOnSelect} 
          error="Error message"
        />
      )
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveClass('border-red-500')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('has proper option roles', async () => {
      const user = userEvent.setup()
      render(<Dropdown items={mockItems} onSelect={mockOnSelect} />)
      
      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(mockItems.length)
    })
  })
})

describe('DropdownMenu Component', () => {
  it('renders trigger and opens menu', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu trigger={<button>Menu</button>}>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Menu')
    await user.click(trigger)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DropdownMenu trigger={<button>Menu</button>}>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenu>
        <button>Outside</button>
      </div>
    )
    
    const trigger = screen.getByText('Menu')
    await user.click(trigger)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    
    const outsideButton = screen.getByText('Outside')
    await user.click(outsideButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })
  })
})

describe('DropdownMenuItem Component', () => {
  it('handles click events', async () => {
    const mockClick = jest.fn()
    const user = userEvent.setup()
    
    render(<DropdownMenuItem onClick={mockClick}>Test Item</DropdownMenuItem>)
    
    const item = screen.getByText('Test Item')
    await user.click(item)
    
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', async () => {
    const mockClick = jest.fn()
    const user = userEvent.setup()
    
    render(<DropdownMenuItem onClick={mockClick}>Test Item</DropdownMenuItem>)
    
    const item = screen.getByText('Test Item')
    item.focus()
    await user.keyboard('{Enter}')
    
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('applies destructive styling', () => {
    render(<DropdownMenuItem destructive>Delete</DropdownMenuItem>)
    
    const item = screen.getByText('Delete')
    expect(item).toHaveClass('text-red-500')
  })

  it('does not trigger when disabled', async () => {
    const mockClick = jest.fn()
    const user = userEvent.setup()
    
    render(<DropdownMenuItem onClick={mockClick} disabled>Test Item</DropdownMenuItem>)
    
    const item = screen.getByText('Test Item')
    await user.click(item)
    
    expect(mockClick).not.toHaveBeenCalled()
  })
})

describe('DropdownSeparator Component', () => {
  it('renders separator with proper role', () => {
    render(<DropdownSeparator />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass('h-px', 'bg-border')
  })
})